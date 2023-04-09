//------This script written by M.Shanab April 2023 ------//
//------Feel free to update this script ------//
//------Regards -----ephedrine2010@gmail.com ------//
$(document).ready(function() {
    readcsvv();
  });
  
  const items = [];
  
    function readcsvv() {
          $.ajax({
              type: "GET",
              url: "items.csv",
              dataType: "text",
              success: function(data) {

                processData(data);
                const outputDiv = document.getElementById("output");
                items.forEach(item => {
                outputDiv.innerHTML += createHTML(item);
                });
            }
        });
    }
  
      function processData(csv) {
          var lines = csv.split("\n");
          //var itemss = [];
  
          for (var i = 1; i < lines.length-1; i++) {
              var line = lines[i].split(",");
              var item_Number = line[0];
              var item_barcode =line[0];
              var itemNameAr = line[1];
              var itemNameEn = line[2];
              var vatEntxt =  line[3] ;
              var vatArtxt = line[4] ;
              var price = line[5];
  
              items.push({
                item_Number: item_Number,
                item_barcode:item_barcode,
                  itemNameAr: itemNameAr,
                  itemNameEn: itemNameEn,
                  vatEntxt: vatEntxt,
                  vatArtxt: vatArtxt,   
                  price: price
              });
          }
  
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const barcode = generateBarcode(item.item_Number);
            item.item_barcode = barcode;
          }
  
          //return itemss;
      }
  
     
      //price template function
      function createHTML(item) {
    return`
    <!-- template 1 -->
      <div class="col pricebox thickborder">
      <table>
          <table class="table table-sm table-borderless">
              
              <tbody>
                <tr>
                  
                  <td class="w-25 h-100" rowspan="2">
                      <div class="border rounded" style="background-color: lightgray;padding: 5px;">
                          <span style="font-size:xx-large;">${item.price}</span>
                          </br>
                          <span>SAR</span>
                          
                          <p style="font-size: x-small;line-height: 0.5;">${item.vatEntxt}</p>
                          <p style="font-size: x-small;line-height: 0.0;">${item.vatArtxt}</p>
                      </div>
                  </td>
                  
                  <td class="align-bottom" colspan="2">
                      ${item.itemNameAr}
                  </td>
                  
                </tr>
                <tr>
                  <td colspan="2">
                      ${item.itemNameEn}
                  </td>
                </tr>
                <tr>
                 
                  <td colspan="3">
                      <img class="margin-top:10px;" src="${item.item_barcode}" alt="qrocde" style="height: 20px; width: 170px;" />
                      </br>
                      <span>${item.item_Number}</span>
                  </td>
                </tr>
              </tbody>
            </table>
      </table>
      </div>
          `
      }
      
    
  
      // Loop through the items array and generate a barcode for each item
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const barcode = generateBarcode(item.itemNumber);
        item.Gtin_barcode = barcode;
      }
  
      //create barcode
          function generateBarcode(number) {
              const canvas = document.createElement('canvas');
  
              JsBarcode(canvas, number, {
                  format: "CODE128",
                  displayValue: false,
                  width: 2,
                  height: 50,
                  margin: 0,
                  text: number,
                  textAlign: "center",
                  textPosition: "bottom"
              });
  
              // Create a new canvas element with a rotated context
              const rotatedCanvas = document.createElement('canvas');
              rotatedCanvas.width = canvas.height;
              rotatedCanvas.height = canvas.width;
              const ctx = rotatedCanvas.getContext('2d');
              ctx.translate(rotatedCanvas.width, 0);
              ctx.rotate(Math.PI / 2);
              ctx.drawImage(canvas, 0, 0);
  
              const dataURL = canvas.toDataURL();
  
              return dataURL;
          }
  