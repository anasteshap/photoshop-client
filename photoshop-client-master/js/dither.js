function dither() {
    let ditheringTypeElement = document.querySelector('select[name="ditheringType"]');
    let ditheringType = ditheringTypeElement.value;

    let bitRateElement = document.querySelector('input[name="bitRate"]');
    let bitRateInt = bitRateElement.value;

    let f = document.getElementById('file').files[0];
    let formData = new FormData();
    formData.append("ditheringType", ditheringType);
    formData.append("bitRate", bitRateInt);

    console.log(ditheringType)
    fetch(`http://localhost:8080/dither`, {
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

    ctx.putImageData(myImageData, 0, 0);
}