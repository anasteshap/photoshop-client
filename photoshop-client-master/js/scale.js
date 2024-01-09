function scaling() {
    console.log("1")
    let scalingTypeElement = document.querySelector('select[name="scalingType"]');
    if (scalingTypeElement == null)
        console.log("scalingTypeElement == null")
    let scalingType = scalingTypeElement.value;

    let newWidthElement = document.querySelector('input[name="newWidth"]');
    let newWidthInt = newWidthElement.value;

    let newHeightElement = document.querySelector('input[name="newHeight"]');
    let newHeightInt = newHeightElement.value;

    let bCoefElement = document.querySelector('input[name="bCoef"]');
    console.log(bCoefElement)

    if (bCoefElement.value === '') {
        bCoefElement.value = 0
        console.log(bCoefElement.value)
    }
    let bCoefInt = bCoefElement.value;

    let cCoefElement = document.querySelector('input[name="cCoef"]');
    if (cCoefElement.value === '')
        cCoefElement.value = 0
    let cCoefInt = cCoefElement.value;

    let f = document.getElementById('file').files[0];
    let formData = new FormData();
    formData.append("scalingType", scalingType);
    formData.append("newWidth", newWidthInt);
    formData.append("newHeight", newHeightInt);
    formData.append("bCoef", bCoefInt);
    formData.append("cCoef", cCoefInt);

    console.log(scalingType)
    fetch(`http://localhost:8080/scale`, {
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