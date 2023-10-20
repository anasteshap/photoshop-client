const NUM_CHANNELS = 3;
const NUM_HEADERS = 4;
const DEFAULT_ALPHA = 255;

let myImageData;
let width;
let height;
let currentColorSpace = 'RGB';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

fetch('http://localhost:8080/getPath')
    .then(response => response.text())
    .then(filePath => {
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = filePath;
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });

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
    let f = document.getElementById('file').files[0];
    let formData = new FormData();
    formData.append("file", f);

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


function convert() {
    // let selectElement = document.getElementsByName("colorSpace");
    // let selectedOption = selectElement.selectedOptions[0];

    let selectElement = document.querySelector('select[name="colorSpace"]');
    let selectedOption = selectElement.options[selectElement.selectedIndex];
    let selectedValue = selectedOption.value;

    // let mainUrl = 'http://localhost:8080/'
    switch (selectedValue) {
        case 'RGB':
            uploadFile('http://localhost:8080/convert/RGB')
            currentColorSpace = 'RGB'
            break
        case 'HSL':
            uploadFile('http://localhost:8080/convert/HSL')
            currentColorSpace = 'HSL'
            break
        case 'HSV':
            uploadFile('http://localhost:8080/convert/HSV')
            currentColorSpace = 'HSV'
            break
        case 'YCbCr.601':
            uploadFile('http://localhost:8080/convert/YCbCr.601')
            currentColorSpace = 'YCbCr.601'
            break
        case 'YCbCr.709':
            uploadFile('http://localhost:8080/convert/YCbCr.709')
            currentColorSpace = 'YCbCr.709'
            break
        case 'YCoCg':
            uploadFile('http://localhost:8080/convert/YCoCg')
            currentColorSpace = 'YCoCg'
            break
        case 'CMY':
            uploadFile('http://localhost:8080/convert/CMY')
            currentColorSpace = 'CMY'
            break
    }

    ctx.putImageData(myImageData, 0, 0);
}


uploadFile = function (endpoint) {
    let f = document.getElementById('file').files[0];
    let formData = new FormData();
    formData.append("currentColorSpace", currentColorSpace);

    console.log(currentColorSpace)

    fetch(endpoint, {
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

// $.ajax({
//     type: "POST",
//     url: "/upload",
//     data: formData,
//     processData: false,
//     contentType: false,
//     success: function (response) {
//         console.log(response, 200); // это выполняется успешно
//     },
//     error: function (error) {
//         console.log(error);
//     }
// });

// let bytes;
// $.ajax({
//     type: "GET",
//     url: "/save",
//     data: formData,
//     processData: false,
//     contentType: 'arrayBuffer',
//     success: function (response) {
//         bytes = new Uint8Array(response);
//         // console.log(response, 200); // это выполняется успешно
//         // console.log(new Uint8Array(response), 200); // это выполняется успешно
//     },
//     error: function (error) {
//         console.log(error);
//     }
// });


// fetch('/save', {method: 'GET'})
//     .then(function (response) {
//         if (response.ok) {
//             return response.arrayBuffer();
//         } else {
//             throw new Error('Ошибка получения данных');
//         }
//     })
//     .then(function (data) {
//         console.log(data);
//     })
//     .catch(error => console.error('Ошибка - ', error));

// r.onloadend = function () {
//     try {
//         console.log(bytes);
//         // parsePPM(bytes);
//         // resizeCanvas();
//         // ctx.putImageData(myImageData, 0, 0);
//         console.log('++++++');
//     } catch (err) {
//         console.log(err);
//     }
// }
// r.readAsArrayBuffer(f);