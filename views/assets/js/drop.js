window.addEventListener("load", function() {


    function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();


        var files = e.dataTransfer.files,
            folders = 0,
            other = 0;

        document.getElementById('nameFile').innerHTML = files[0].name;

        var req = new XMLHttpRequest();
        var form = new FormData();

        form.append('file',files[0]);
        req.open('POST','/dashboard/upload');
        req.send(form);
        window.location.href = '/dashboard?msg=fileUploaded'



    }

    function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        document.getElementById("DPH").classList.add("dph");

    }

    function handleDragEnter(e) {
        e.stopPropagation();
        e.preventDefault();
        document.getElementById("DPH").classList.add("dph");
    }

    function handleDragLeave(e) {
        e.stopPropagation();
        e.preventDefault();
        document.getElementById("DPH").classList.remove("dph");
    }

    var dropZone = document.getElementById('drop_zone');

    dropZone.addEventListener('dragenter', handleDragEnter, false);
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('dragleave', handleDragLeave, false);
    dropZone.addEventListener('drop', handleDrop, false);
});