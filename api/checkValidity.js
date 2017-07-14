var ps = require('ps-node');
var fs = require('fs');
var path = require('path');
var macaddress = require('node-macaddress');
var os = require('os');
var tmp = os.tmpdir() + "/croatoan";
var cmd = require('node-cmd');

var processes = [];

var macA;
var validity;



var cpath = __dirname.split("/EDUNGURU.app")[0]+"/.content";
cpath = cpath.replace(" ","\\ ");



window.localStorage.setItem("cpath", cpath.replace("\\ ", " "));



var javaPath = cpath + "/javaOSX/bin";
var classPath = cpath + "/java";





window.localStorage.setItem('tmp', tmp);


if (!fs.existsSync(tmp)) {
      try {
        fs.mkdirSync(tmp);
    } catch (err) {
        alert(err)
    }
}

try{
    $(document).keydown(function (e) {
        e.preventDefault();
        alert("Please don't press any keys while the app is on. The appication will quit now.");
        window.close();
    });
} catch(err){

    alert(err)
}





cmd.get(javaPath + '/java -cp ' + classPath + ' ed ' + cpath + '/validity.eng ' + cpath + '/validity.json decrypt', function (err, data, stderr) {

    


    if (data.indexOf('success') >= 0) {

            try {
                    
                validity = JSON.parse(fs.readFileSync(window.localStorage.getItem("cpath") + "/validity.json", 'utf8'));
             } catch (e) {

                 alert('Error : '+ e);
             }
       

         cmd.get('system_profiler SPUSBDataType | grep "Serial Number" -B5', function (err, data, stderr) {
                    if (data.indexOf(validity.usbNumber) < 0) {
                        alert("Sorry! You're not authorized to run this Application!");
                        window.close();
                    }

                }
        ); 


        var loadingDate = new Date(validity.loadingDate);
        var validUpto = new Date(validity.validUpto);
        var lastAccessedOn = new Date(validity.lastAccessedOn);
        var today = new Date();
        validity.lastAccessedOn = today.toISOString().slice(0, 10).replace(/-/g, "-");

        macaddress.one(function (err, mac) {
            macA = mac;

            if ($.inArray(macA, validity.whitelistedDevices) >= 0) {

            } else {
                if (validity.devices.length == 2 && $.inArray(macA, validity.devices) < 0) {
                    alert("Sorry! You can use the application only on maximum two devices!");
                    window.close();
                } else {
                    if (validity.devices.length < 2 && validity.devices.indexOf(macA) < 0) {
                        validity.devices.push(macA);
                        alert("You are using " + validity.devices.length + " of 2 allowed devices.");
                    }
                }
            }
        });



              
        fs.writeFile(window.localStorage.getItem("cpath") + "/validity.json", JSON.stringify(validity), function (err) {

            cmd.get(javaPath + '/java -cp ' + classPath + ' ed ' + cpath + '/validity.json ' + cpath + '/validity.eng encrypt', function (err, data, stderr) {
                if (data.indexOf('success') >= 0) {
                    cmd.get(javaPath + '/java -cp ' + classPath + ' del ' + cpath + '/validity', function (err, data, stderr) {
                        if (loadingDate > today || today > validUpto || today < lastAccessedOn) {
                            alert("Sorry! The validity of this application is over!");
                            window.close();
                        }

                        window.localStorage.setItem("validity", JSON.stringify(validity));

                        cmd.get(javaPath + '/java -Xmx500M -cp ' + classPath + ' ed ' + cpath + '/content.eng ' + cpath + '/content.json decrypt', function (err, data, stderr) {
                        var content = fs.readFileSync(window.localStorage.getItem("cpath") + "/content.json", 'utf8');
                        window.localStorage.setItem("content", content);

                        cmd.get(javaPath + '/java -cp ' + classPath + ' del ' + cpath + '/content', function (err, data, stderr) {

                            ps.lookup({}, function (err, resultList) {
                                if (err) {
                                    throw new Error(err);
                                }

                                var p = "";
                                resultList.forEach(function (process) {
                                    if (process.command) {

                                        processes.push(path.basename(process.command).toLowerCase());
                                    }
                                });
                                processes = processes.filter(function (elem, pos) {
                                    return processes.indexOf(elem) == pos;
                                });

                            

                                var notAllowed = JSON.parse(window.localStorage.getItem("validity")).blacklistedApps;
                                var results = processes.filter(function (fs) {
                                    return notAllowed.some(function (ff) {
                                        return fs.indexOf(ff) > -1
                                    });
                                });
                                if (results.length <= 0) {
                                    cmd.get(javaPath + '/java -cp ' + classPath + ' del ' + cpath + '/validity', function (err, data, stderr) {
                                        cmd.get(javaPath + '/java -cp ' + classPath + ' del ' + cpath + '/content', function (err, data, stderr) {
                                            window.location.href = 'index.html';
                                        });
                                    });


                                } else {
                                    alert("Seems like you're running video recording software in the background. Please close the software and restart the application.");
                                    window.close();
                                }
                            });

                        });
});

                    });
                } else {
                    alert("Sorry! Something has gone wrong!");
                    cmd.get(javaPath + '/java -cp ' + classPath + ' del ' + cpath + '/validity', function (err, data, stderr) {});
                    cmd.get(javaPath + '/java -cp ' + classPath + ' del ' + cpath + '/content', function (err, data, stderr) {});

                    window.close();
                }
            });
        });


    } else {

        alert("Sorry! Something has gone wrong!");
        cmd.get(javaPath + '/java -cp ' + classPath + ' del ' + cpath + '/validity', function (err, data, stderr) {});
        cmd.get(javaPath + '/java -cp ' + classPath + ' del ' + cpath + '/content', function (err, data, stderr) {});

        window.close();
    }


});



