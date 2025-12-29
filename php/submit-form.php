<?php
if(empty($_POST['name']) || empty($_POST['email']) || empty($_POST['mobile'])) {
  echo json_encode(['success'=>false,'message'=>'All fields required']);
  exit;
}

$to = "krishnamathil@gmail.com";   // 👈 REPLACE WITH YOUR GREENGEEKS EMAIL
$subject = "New Lead from Website";

$message = "
Name: {$_POST['name']}
Email: {$_POST['email']}
Mobile: {$_POST['mobile']}
";

$headers = "From: Website <contact@maflar.com>";

mail($to, $subject, $message, $headers);

echo json_encode(['success'=>true]);
