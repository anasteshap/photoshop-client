const canvasHistogram = document.getElementById('canvasHistogram');
const ctxHistogram = canvasHistogram.getContext('2d');

function histogram() {
    fetch(`http://localhost:8080/histogram`, {
        method: 'GET',
    })
        .then(response => response.blob())
        .then(blob => {
            // Создаем объект Image для отображения на canvas
            const img = new Image();
            img.onload = function() {
                resizeCanvasHistogram();
                // Рисуем изображение на canvas
                ctxHistogram.drawImage(img, 0, 0);
            };
            img.src = URL.createObjectURL(blob);
        })
        .catch(error => console.error('Error loading image:', error));
    // ctxHistogram.putImageData(myImageData, 0, 0);
}

resizeCanvasHistogram = function () {
    canvasHistogram.width = 256;
    canvasHistogram.height = 300;
};

function chooseBoarder() {
    let selectElement = document.querySelector('input[name="autocorrectionName"]');
    let inputValue = selectElement.value;
    let doubleValue = parseFloat(inputValue);
    correction(doubleValue, "autocorrection");
}

function correction(doubleValue, endpoint) {
    let f = document.getElementById('file').files[0];
    let formData = new FormData();
    formData.append("boarder", doubleValue);

    fetch(`http://localhost:8080/${endpoint}`, {
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

    console.log(doubleValue)
    ctx.putImageData(myImageData, 0, 0);
}
