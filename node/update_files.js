var fs = require('fs');
var shell = require('child_process');

var outPath = process.argv[2] || '0930';
outPath = './publish/' + outPath;
/*
    1.清空outPath
    把./css ./js ./images ./libs ./res 的文件拷贝到outPath
*/
clearFolder(outPath,function(){
    let folder_list = ['js','css','images','libs','res','json'];
    copyTo(folder_list, outPath, function (err,data) {
        console.log(err,data);
    })
});


function copyTo(list, oPath, callback) {
    let loadedCount = 0;
    let totalCount = list.length;
    for (let f of list) {
        let shell_str =  'cp -r ./' + f + ' ' + oPath;
        console.log(shell_str);
        shell.exec(shell_str, function (err, res) {
            console.log(loadedCount);
            loadedCount++;
            if (totalCount == loadedCount) {
                //callback(err, res);
            }
        });
    }
}

function clearFolder(path,callback) {
    shell.exec('rm -rf ' + path, function (err, res) {
        shell.exec('mkdir ' + path,callback);
    });
}