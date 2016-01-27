<?
	$playername = 'iDOLM@STER';
	$playerlink = 'http://ster.life/imas';
?>

<!doctype html>
<html>
<head>
	<meta charset=utf-8>
	<link rel="stylesheet" href="style.css">
	<title> <? echo $playername; ?> MUSIC PLAYER </title>
</head>
<body>
	<p style="text-align:center;"><span id="songname"></span></p>
	<p style="text-align:center;"><span id="composer"></span></p>
	<div class="circular" id="playerbackground" style="background-image: url(blank.jpg);">
	</div>
	<canvas id="playfill" width="300" height="300" style="position:absolute; left: 50%; margin-left: -250px; width: 300px; height: 300px; top:80px; opacity: 0.4"></canvas> 
	<div id="prev" style="position:absolute; left: 50%; margin-left: 50px; top: 98px; color:#999"> &nbsp; <br/> &nbsp; <br/> &nbsp; </div>
	<div id="now" style="position:absolute; left: 50%; margin-left: 80px; top: 198px"> &nbsp; <br/> &nbsp; <br/> &nbsp; </div>
	<div id="next" style="position:absolute; left: 50%; margin-left: 50px; top: 298px; color:#999" > &nbsp; <br/> &nbsp; <br/> &nbsp; </div>
	
	<div id="pp" class = "pp" style= "background-image: url(pause.png);"> </div>
	<audio src="blank.mp3" controls="controls" id="audio_player" autoplay hidden=hidden ></audio>
	<span style="position: fixed; right: 10px; bottom: 10px;">
	<a href="https://twitter.com/share" class="twitter-share-button" data-url="<? echo $playerlink; ?>" data-text="<? echo $playername; ?> Music Player!" id="twttr">Tweet</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
	</span>
	<script src="logic.js"></script>
</body>
</html>

