<?php
    $directory_path = $_POST['directory_path'];
    $file_path = $directory_path . '/' . $_POST['file_name'];

    if (is_file($file_path)) {
        $subjNumFile = fopen($file_path, 'r');
        $subjNum = fgets($subjNumFile) + 1;
        fclose($subjNumFile);
    } else {
        $subjNum = 1;
    }
    echo $subjNum;
    
    $subjNumFile = fopen($file_path, 'w');
    fwrite($subjNumFile, $subjNum);
    fclose($subjNumFile);
?>