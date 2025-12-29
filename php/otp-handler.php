<?php
session_start();

if(isset($_POST['mobile'])) {
    $otp = rand(100000,999999);
    $_SESSION['otp'] = $otp;
    echo json_encode(['otp'=>$otp]); // TEST ONLY
    exit;
}

if(isset($_POST['verifyOtp'])) {
    $valid = $_POST['verifyOtp'] == $_SESSION['otp'];
    echo json_encode(['success'=>$valid]);
    exit;
}
