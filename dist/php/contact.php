<?php

if(isset($_POST['message'])){

	$name = $_POST['name'];
	$email = $_POST['email'];
	$message = $_POST['message'];
    
	
	$to      = 'mail@totest.zzz.com.ua';
	$subject = 'Site Contact Form';

	/*$headers = 'From: '. $email . "\r\n" .*/
	$headers = 'From: '. $to . "\r\n" .
    'Reply-To: '. $email . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

	$status = mail($to, $subject, $message, $headers);

	if($status == TRUE){	
		$res['sendstatus'] = 'done';
	
		//Edit your message here
		$res['message'] = 'Ваша заявка успешно отправлена';
    }
	else{
		$res['message'] = 'Ошибка отправки. Напишите мне vlad.kudinov.89@gmail.com';
	}
	
	
	echo json_encode($res);
}

?>