function createGradient() {
    // let f = document.getElementById('file').files[0];
    let formData = new FormData();
    formData.append("gamma", parseFloat("2"));

    fetch(`http://localhost:8080/createGradient`, {
        method: 'POST',
        body: formData
    })
        .then(response => response.arrayBuffer())
        .then(data => {
            // let r = new FileReader();
            // r.onloadend = function () {
                try {
                    parsePPM(data);
                    resizeCanvas();
                    ctx.putImageData(myImageData, 0, 0);
                } catch (err) {
                    console.log(err);
                }
        //     }
        //     r.readAsArrayBuffer(f);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });

    ctx.putImageData(myImageData, 0, 0);
}