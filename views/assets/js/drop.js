window.addEventListener("load", function() {


    function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();


        var files = e.dataTransfer.files,
            folders = 0,
            other = 0;



        //TODO FORM e mandar files   
        for (var i = 0, f; f = files[i]; i++) { // iterate in the files dropped
            if (!f.type && f.size % 4096 == 0) folders++;
            else other++;
        }

        if (folders && !other) {
            if (folders > 1) info.innerHTML = 'You dropped ' + folders + ' folders!';
            else info.innerHTML = 'You dropped 1 folder!';
        } else if (!folders && other) {
            if (other > 1) info.innerHTML = 'You dropped ' + other + ' files!';
            else info.innerHTML = 'You dropped 1 file!';
        } else {
            if (folders > 1) info.innerHTML = 'You dropped ' + folders + ' folders ';
            else info.innerHTML = 'You dropped 1 folder ';
            if (other > 1) info.innerHTML += 'and ' + other + ' files!';
            else info.innerHTML += 'and 1 file!';
        }
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