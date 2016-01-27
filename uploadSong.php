<?
	$md5pw = "81dc9bdb52d04dc20036dbd8313ed055";
?>

<?
function generateRandomString($length = 32) {
    $characters = '0123456789abcdef';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function doFileUpload($filename, $fileptr)
{
	$res = move_uploaded_file($fileptr["tmp_name"], $filename);
	if($res)
		echo "Success Uploading ".$filename."<br/>";
	else
		echo "Problem Uploading ".$filename."<br/>";
}

function run()
{
	if(!isset($_POST["pw"]))
		return;
	if(md5($_POST["pw"])!==$md5pw) die ("<!DOCTYPE html><html><head><meta charset=utf-8> <title> Add Song! </title> </head> <body> Wrong Password! </body> </html>");
	
	$x = time()."_".generateRandomString(32); //hopefully not duplicate :)
	mkdir($x);
	$target_dir=$x."/";
	
	$fp = fopen("songlist","a");
	fwrite($fp,$x."\n");
	fclose($fp);
	
	$fp = fopen($target_dir."songdata","w");
	echo htmlentities($_POST["music_name"], ENT_QUOTES,"UTF-8");
	echo "<br/>";
	echo htmlentities($_POST["composer"], ENT_QUOTES,"UTF-8");
	fwrite($fp, base64_encode( htmlentities($_POST["music_name"], ENT_QUOTES,"UTF-8") ) );
	fwrite($fp, "\n");
	fwrite($fp, base64_encode( htmlentities($_POST["composer"], ENT_QUOTES,"UTF-8") ) );

	fclose($fp);
	
	doFileUpload($target_dir."song.mp3",$_FILES["mp3"]);
	doFileUpload($target_dir."song.lrc",$_FILES["lrc"]);
	doFileUpload($target_dir."folder.png",$_FILES["png"]);
	
}
error_reporting(E_ALL);
date_default_timezone_set('Asia/Seoul');
run();

?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title> Add Song! </title>
	</head>
	<body>
		<form action="addsong.php" method="post" enctype="multipart/form-data">
			Select File to upload: <br/>
			<input type="hidden" name="pw" value = "1234">
			Music Name: <input type="text" name="music_name"> <br/>
			Composer: <input type="text" name="composer"> <br/>
			MP3 File: <input type="file" name="mp3"> <br/>	
			Lyrics File: <input type="file" name="lrc"> <br/>
			Cover Image(should be png): <input type="file" name="png"> <br/>
			<input type="submit">
		</form>
	</body>
</html>
