const NUM_CHANNELS = 3;
const NUM_HEADERS = 4;
const DEFAULT_ALPHA = 255;

let myImageData;
let width;
let height;
let currentColorSpace = 'RGB';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// fetch('http://localhost:8080/getPath')
//     .then(response => response.text())
//     .then(filePath => {
//         const downloadLink = document.getElementById('downloadLink');
//         downloadLink.href = filePath;
//     })
//     .catch(error => {
//         console.error('Ошибка:', error);
//     });

parsePPM = function (data) {
    let i;
    console.log(data);
    data = new Uint8Array(data);
    console.log(data);

    const headers = [];
    let headerSize = 0;

    let buf = "";
    for (i = 0; headers.length < NUM_HEADERS; i++, headerSize++) {
        const ch = String.fromCharCode(data[i]);
        if (/\s/.test(ch)) {
            headers.push(buf);
            buf = "";
        } else {
            buf += ch;
        }
    }

    width = headers[1];
    height = headers[2];
    maxval = headers[3];

    if (!(maxval >= 0 && maxval <= 255)) throw "Bit depth of image must be no more than 8";

    const raster = data.slice(headerSize);

    //canvas requires alpha channel
    const lenWithAlpha = (raster.length / NUM_CHANNELS) + raster.length;
    const bytes = new Uint8ClampedArray(lenWithAlpha);

    let index = 0;
    for (i = 0; i < lenWithAlpha; i++) {
        if (i % 4 === NUM_CHANNELS) bytes[i] = DEFAULT_ALPHA;
        else bytes[i] = raster[index++];
    }

    myImageData = new ImageData(bytes, width, height);
};

// upload =  function () {
//     uploadFile('http://localhost:8080/upload')
// }

upload = function () {
    // let form = document.getElementById("uploadForm");
    // let formData = new FormData(form);

    let f = document.getElementById('file').files[0];
    let selectElement = document.querySelector('select[name="colorSpace"]');
    let selectedOption = selectElement.options[selectElement.selectedIndex];
    let selectedValue = selectedOption.value;
    let gammaElement = document.querySelector('input[name="gamma"]');
    let gammaValue = gammaElement.value;

    let formData = new FormData();
    formData.append("file", f);
    formData.append("ColorSpace", selectedValue);
    formData.append("gamma", gammaValue);

    fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.arrayBuffer())
        .then(data => {
            let r = new FileReader();
            r.onloadend = function () {
                try {
                    parsePPM(data);
                    resizeCanvas();
                    ctx.putImageData(myImageData, 0, 0);
                } catch (err) {
                    console.log(err);
                }
            }
            r.readAsArrayBuffer(f);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
};


resizeCanvas = function () {
    canvas.width = width;
    canvas.height = height;
};


function chooseFilter() {
    let selectElement = document.querySelector('select[name="channel"]');
    let selectedOption = selectElement.options[selectElement.selectedIndex];
    let selectedValue = selectedOption.value;

    let f = document.getElementById('file').files[0];
    let formData = new FormData();
    formData.append("channelNumber", selectedValue);

    fetch('http://localhost:8080/filter/oneChannel', {
        method: 'POST',
        body: formData
    })
        .then(response => response.arrayBuffer())
        .then(data => {
            let r = new FileReader();
            r.onloadend = function () {
                try {
                    parsePPM(data);
                    resizeCanvas();
                    ctx.putImageData(myImageData, 0, 0);
                } catch (err) {
                    console.log(err);
                }
            }
            r.readAsArrayBuffer(f);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });

    console.log(selectedValue)
    ctx.putImageData(myImageData, 0, 0);
}

function convert() {
    let selectElement = document.querySelector('select[name="toColorSpace"]');
    let selectedOption = selectElement.options[selectElement.selectedIndex];
    let selectedValue = selectedOption.value;

    uploadFile(selectedValue);
    console.log(selectedValue)
    ctx.putImageData(myImageData, 0, 0);
}


uploadFile = function (colorSpace) {
    let f = document.getElementById('file').files[0];
    let formData = new FormData();
    formData.append("toColorSpace", colorSpace);

    fetch('http://localhost:8080/convert/newColorSpace', {
        method: 'POST',
        body: formData
    })
        .then(response => response.arrayBuffer())
        .then(data => {
            let r = new FileReader();
            r.onloadend = function () {
                try {
                    parsePPM(data);
                    resizeCanvas();
                    ctx.putImageData(myImageData, 0, 0);
                } catch (err) {
                    console.log(err);
                }
            }
            r.readAsArrayBuffer(f);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
};