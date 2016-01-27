var xhr, xhr2;
var songlist;
var playpause = document.getElementById("pp");
var play = true;
var mp=document.getElementById("audio_player");
var pbg = document.getElementById("playerbackground");
var playing = -1;
var lyrics=[];
var prev = document.getElementById("prev");
var now = document.getElementById("now");
var next = document.getElementById("next");

function isCharDigit(a)
{
	if('0'<=a && a<='9') return true;
	return false;
}

function dp()	
{	
	if(play) document.getElementById("pp").style.backgroundImage = 'url("pause.png")';
	else document.getElementById("pp").style.backgroundImage = 'url("play.png")';
}
function toggle()
{
	if(mp.paused) mp.play();
	else mp.pause();
	return;
}
var c = document.getElementById("playfill");
var ctx = c.getContext("2d");	
function getMousePos(canvas, evt)
{
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}
function drawProgress(ratio)
{
	
	ctx.clearRect(0,0,300,300);
	ctx.fillStyle = "#000000";
	ctx.beginPath();
	ctx.arc(150,150,151,-0.5*Math.PI,(-0.5+2*ratio)*Math.PI);
	ctx.lineTo(150,150);
	ctx.fill();
}
function movemusic(event)
{
	v = getMousePos(c,event);
	if(v.x==150 && v.y==150) return;
	ratio = Math.atan2(v.y-150,v.x-150);
	ratio += Math.PI;
	ratio /= 2*Math.PI;
	ratio -= 0.25;
	if(ratio<0) ratio+=1;
	mp.currentTime = Math.floor(ratio*mp.duration);
}
function titleset()
{
	if(xhr.readyState==4)
	{
		var songtitle=decodeURIComponent(escape(atob(xhr.responseText.split("\n")[0])));
		var songcomposer=decodeURIComponent(escape(atob(xhr.responseText.split("\n")[1])));
		songname.innerHTML = songtitle;
		composer.innerHTML = songcomposer;
		document.title = songname.textContent + " - " + composer.textContent;
	}
}

function lyricset()
{
	if(xhr2.readyState==4)
	{
		var tmp=xhr2.responseText.split("\n");
		lyrics=[];
		lyrics.push([-0.5,"&nbsp;<br/>&nbsp;<br/>&nbsp;"]);
		for(var i=0; i<tmp.length; i++)
		{
			var lrc=tmp[i];
			if(lrc.length<10) continue;
			if(lrc[0]!='[')continue;
			if(lrc[3]!=':')continue;
			if(lrc[6]!='.')continue;
			if(lrc[9]!=']')continue;
			if(!isCharDigit(lrc[1])) continue;
			if(!isCharDigit(lrc[2])) continue;
			if(!isCharDigit(lrc[4])) continue;
			if(!isCharDigit(lrc[5])) continue;
			if(!isCharDigit(lrc[7])) continue;
			if(!isCharDigit(lrc[8])) continue;
			var lyric=lrc.substring(10);
			var timecalc=
			((lrc[1]-'0')*10+(lrc[2]-'0'))*60+
			((lrc[4]-'0')*10+(lrc[5]-'0'))*1+
			((lrc[7]-'0')*10+(lrc[8]-'0'))*0.01;
			var topush=[timecalc,lyric];
			lyrics.push(topush);
		}
	}
}

function reloadlyrics()
{
	if(!lyrics) return;
	var nowtime=mp.currentTime;
	var maxv=-1;
	var maxi=0;
	for(var i=0;i<lyrics.length;i++)
	{
		var t=lyrics[i];
		if(maxv<t[0] && t[0]<=nowtime)
		{
			maxv=t[0];
			maxi=i;
		}
	}
	
	prev.innerHTML="&nbsp;<br/>&nbsp;<br/>&nbsp;";
	if(lyrics[maxi-1]) prev.innerHTML=lyrics[maxi-1][1];
	
	now.innerHTML="&nbsp;<br/>&nbsp;<br/>&nbsp;";
	if(lyrics[maxi]) now.innerHTML=lyrics[maxi][1];
	
	next.innerHTML="&nbsp;<br/>&nbsp;<br/>&nbsp;";
	if(lyrics[maxi+1]) next.innerHTML=lyrics[maxi+1][1];
}

function doplay()
{
	if(!songlist)
	{
		mp.setAttribute("src","blank.mp3");
		mp.play();
		return;
	}
	musicdirname = songlist[playing];
	mp.setAttribute("src",musicdirname+"/song.mp3");
	x = 'url('+musicdirname +'/folder.png)';
	pbg.style.setProperty('background-image',x);
	
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = titleset;
	xhr.open("GET",musicdirname+"/songdata",true);
	xhr.send();
	
	xhr2 = new XMLHttpRequest();
	xhr2.onreadystatechange = lyricset;
	xhr2.open("GET",musicdirname+"/song.lrc",true);
	xhr2.send();
}


function playnext()
{
	playing = playing + 1;
	playing %= songlist.length;
	doplay();
}

function init()
{
	c.addEventListener('click',movemusic);
	playpause.onclick=toggle;
	mp.onpause=sync;
	mp.onplay=sync;
	mp.ontimeupdate=sync;
	mp.onended = playnext;
	playnext();
}

function sync()
{
	play = !mp.paused;
	dp();
	drawProgress(mp.currentTime/mp.duration);
	reloadlyrics();
}

function shuffle()
{
	var len = songlist.length;
	for(var i=0; i<len; i++)
	{
		var sw = Math.floor(Math.random()*(len-i))+i;
		var tmp = songlist[i];
		songlist[i] = songlist[sw];
		songlist[sw] = tmp;
	}
}

function process()
{
	if(xhr.readyState==4)
	{
		tmpsonglist = xhr.responseText.split("\n");
		songlist = []
		for(var i in tmpsonglist)
		{
			if(tmpsonglist[i]!="")
				songlist.push(tmpsonglist[i].trim());
		}
		shuffle();
		init();
	}
}

function loadmusiclist()
{
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = process;
	xhr.open("GET","songlist","true");
	xhr.send();
}

loadmusiclist();
