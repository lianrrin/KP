$(document).ready(function() {
   window.addEventListener("scroll", function(event){
      let top = this.pageYOffset;
      let yPos = -top
      $('#upload-container').attr('style','transform: translate3d(0px, ' + yPos + 'px, 0px)');
      $('#response').attr('style','transform: translate3d(0px, ' + yPos * 1.5 + 'px, 0px)');
      $('#background').attr('style','transform: translate3d(0px, ' + yPos * 1.5 + 'px, 0px)');
      $('#find-cats').attr('style','transform: translate3d(0px, ' + top + 'px, 0px); opacity: ' + 100/top)
   });

   var dropZone = $('#upload-container');

   $('#file-input').focus(function() {
      $('label').addClass('focus');
   })
   .focusout(function() {
      $('label').removeClass('focus');
   });


   dropZone.on('drag dragstart dragend dragover dragenter dragleave drop', function(){
      return false;
   });

   dropZone.on('dragover dragenter', function() {
      dropZone.addClass('dragover');
   });

   dropZone.on('dragleave', function(e) {
      let dx = e.pageX - dropZone.offset().left;
      let dy = e.pageY - dropZone.offset().top;
      if ((dx < 0) || (dx > dropZone.width()) || (dy < 0) || (dy > dropZone.height())) {
         dropZone.removeClass('dragover');
      }
   });

   dropZone.on('drop', async function (e) {
      dropZone.removeClass('dragover');
      let files = e.originalEvent.dataTransfer.files;
      let number = await sendFiles(files);
      $("#response").html("Найдено " + number + " людей")
   });

   $('#file-input').change(async function () {
      let files = this.files;
      let number = await sendFiles(files);
      $("#response").html("Найдено " + number + " людей")
   });


   async function sendFiles(files) {
      let maxFileSize = 18388608;
      let form = new FormData();

      $('#response').html("Подождите...");

      if (files[0].size <= maxFileSize) {
         form.append('file', files[0]);
         let reader = new FileReader();
         reader.onload = (ev) => {
            document.getElementById('upload-image').hidden = true;

            let img = document.getElementById('uploaded-image');
            img.hidden = false;
            img.src = ev.target.result;
            document.getElementById('upload-container').style.opacity = "0.9";
            document.getElementById('uploaded-image').style.border = "1px solid #e0e0e5";
         };
         reader.readAsDataURL(files[0]);
      } else {
         $('#response').html("Try another file:(");
         alert('Неподдерживаемый файл');
      }

      return await fetch('http://127.0.0.1:8000/', {
         method: 'POST',
         body: form,
      })
         .then(response =>
            response.json().then(data => ({
                  data: data,
                  status: response.status
               })
            ))
         .then(res => {
            let number = res.data.number;
            console.log(number)
            return (number)
         })
         .then(number => {
            return number;
         });
   }
})
