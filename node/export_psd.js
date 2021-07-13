var PSD = require('psd');
var fs = require('fs');

var PNG = require('pngjs').PNG;
var JPEGEncoder = require('jpg-stream/encoder');
var PNGDecoder = require('png-stream/decoder');
var ColorTransform = require('color-transform');

var filePath = process.argv[2] || './assets/psd/page.psd';
var outPath = process.argv[3] || './assets/page';

var startTime = +new Date();

function getChildrenData(children, configTemp) {
    var index = children.length;

    children.forEach(function (node) {
        var name = node.name;
        var parent = node.parent;
        var coords = node.coords;
        var pName = parent.name;

        var top = Math.abs(coords.top) == Infinity ? 0 : coords.top;
        var bottom = Math.abs(coords.bottom) == Infinity ? 0 : coords.bottom;
        var left = Math.abs(coords.left) == Infinity ? 0 : coords.left;
        var right = Math.abs(coords.right) == Infinity ? 0 : coords.right;
        var width = (right - left) || 0;
        var height = (bottom - top) || 0;

        var ww = node.get('width');
        var hh = node.get('height');

        var zIndex = index--;

        var attr = parseArgs2Attr(name);
        var anchor = attr.anchor || '[0.5, 0.5]';
        var type = attr.type || 'sprite';

        anchor = JSON.parse(anchor);

        attr.z = zIndex;
        attr.rect = [left + width * anchor[0], bottom - height * anchor[1], width, height];
        attr.color && (attr.color = JSON.parse(attr.color));
        attr.scale && (attr.scale = JSON.parse(attr.scale));
        attr.action && (attr.action = JSON.parse(attr.action));
        attr.origin && (attr.origin = JSON.parse(attr.origin));

        for (var key in attr) {
            try {
                attr[key] = JSON.parse(attr[key]);
            } catch (e) {

            }
        }

        !configTemp[type] && (configTemp[type] = {});

        var attrName = attr['name'];

        delete attr.name;
        delete attr.type;

        configTemp[type][attrName] = attr;

        if (pName) {
            var pAttr = parseArgs2Attr(pName);
            var pAttrName = pAttr.name;
            var pType = pAttr.type || 'layer';
            !configTemp[pType][pAttrName]['node'] && (configTemp[pType][pAttrName]['node'] = {});
            !configTemp[pType][pAttrName]['node'][type] && (configTemp[pType][pAttrName]['node'][type] = []);
            configTemp[pType][pAttrName]['node'][type].push(attrName);
        }

        if (node.isGroup()) {

            if (type === 'animation') {
                var child = node.children();
                var len = child.length;
                configTemp[type][attrName]['length'] = len;
                configTemp[type][attrName]['frames'] = [];
                for (var i = 0; i < len; i++) {
                    var node2 = child[i];
                    var coords2 = node2.coords;
                    var x1 = coords2.left;
                    var y1 = coords2.top;

                    var x2 = x1 - left;
                    var y2 = y1 - top;

                    let w = coords2.right - coords2.left;
                    let h = coords2.bottom - coords2.top;

                    console.log(attrName,coords2);
                    var imgPath = outPath + "/" + (attrName + '_' + (len - i)) + ".png";

                    configTemp[type][attrName]['frames'].push({
                        x:x2,
                        y:y2,
                        w:w,
                        h:h
                    });
                    var png = node2.toPng();
                    png.pack().pipe(new PNG())
                        .on('parsed', function (path, w, h, x, y) {
                            return function () {
                                var dst = new PNG({
                                    width: w,
                                    height: h
                                });
                                this.bitblt(dst, 0, 0, this.width, this.height, x, y);
                                dst.pack().pipe(fs.createWriteStream(path));
                            }
                        }(imgPath, ww, hh, x2, y2));
                }
            } else if(type == "text"){
                var child = node.children();
                var len = child.length;
                configTemp[type][attrName]['length'] = len;
                configTemp[type][attrName]['frames'] = {};
                for (var i = 0; i < len; i++) {
                    var node2 = child[i];
                    var coords2 = node2.coords;
                    
                    var x1 = coords2.left;
                    var y1 = coords2.top;

                    var x2 = x1 - left;
                    var y2 = y1 - top;

                    let w = coords2.right - coords2.left;
                    let h = coords2.bottom - coords2.top;

                    console.log(coords2);
                    var imgPath = outPath + "/" + (attrName + '_' + node2.name) + ".png";

                    configTemp[type][attrName]['frames'][node2.name] = {
                        x:x2,
                        y:y2,
                        w:w,
                        h:h
                    };
                    var png = node2.toPng();
                    png.pack().pipe(new PNG())
                        .on('parsed', function (path, w, h, x, y) {
                            return function () {
                                var dst = new PNG({
                                    width: w,
                                    height: h
                                });
                                this.bitblt(dst, 0, 0, this.width, this.height, x, y);
                                dst.pack().pipe(fs.createWriteStream(path));
                            }
                        }(imgPath, ww, hh, x2, y2));
                }
            }
            else{
                getChildrenData(node.children(), configTemp);
            }
            return true;
        }

        var imgPath = outPath + "/" + attrName + ".png";
        node.saveAsPng(imgPath)
            .catch(function (err) {
                console.log(err.stack);
            });

    });
}

PSD.open(filePath).then(function (psd) {
    var configTemp = {};
    var children = psd.tree().children();

    clearFolder(outPath);

    getChildrenData(children, configTemp);

    fs.writeFile('./json/page_config.json',JSON.stringify(configTemp, null, '\t'), {
        flag: 'w',
        encoding: 'utf-8',
        mode: '0666'
    }, function (err) {
        if (err) {
            console.log("config写入失败")
        } else {
            console.log("config写入成功");
        }
    })


}).then(function () {
    console.log("Finished in " + ((+new Date()) - startTime) + "ms");
}).catch(function (err) {
    console.log(err.stack);
});

function parseArgs2Attr(args, rect) {
    var argsArr = args.split(' ');
    var attrTemp = {};

    if (argsArr.length >= 1) {
        attrTemp['name'] = argsArr.shift();
    }

    for (var i = 0; i < argsArr.length; i++) {
        var argsI = argsArr[i];
        if (argsI.indexOf('--') >= 0) {
            var argsTemp = argsI.replace(/-/g, '');
            attrTemp[argsTemp] = argsArr[++i];
        } else {
            console.log('参数错误 2');
            console.log(args, argsArr);
            return false;
        }
    }

    return attrTemp;
}

function clearFolder(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        // fs.rmdirSync(path);
    } else {
        fs.mkdir(path);
    }
}