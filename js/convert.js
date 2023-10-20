// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
//
// let myImageData;
//
//
// function convert() {
//     let selectElement = document.getElementsByName("colorSpace");
//     let selectedOption = selectElement.selectedOptions[0];
//
//     switch (selectedOption.textContent) {
//         case 'RGB':
//             break
//         case 'HSL':
//             break
//         case 'HSV':
//             break
//         case 'YCbCr.601':
//             break
//         case 'YCbCr.709':
//             break
//         case 'YCoCg':
//             break
//         case 'CMY':
//             break
//     }
//
//     ctx.putImageData(myImageData, 0, 0);
// }
//
// function displayHSLImage(hslData, width, height) {
//     for (let y = 0; y < height; y++) {
//         for (let x = 0; x < width; x++) {
//             const index = y * width + x;
//             const { h, s, l } = hslData[index];
//
//             ctx.fillStyle = `hsl(${h}, ${s}%, ${l}%)`;
//             ctx.fillRect(x, y, 1, 1);
//         }
//     }
// }