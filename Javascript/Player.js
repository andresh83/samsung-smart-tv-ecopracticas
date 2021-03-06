var Player =
{
    plugin : null,
    state : -1,
    skipState : -1,
    stopCallback : null,    /* Callback function to be set by client */
    originalSource : null,
    
    STOPPED : 0,
    PLAYING : 1,
    PAUSED : 2,  
    FORWARD : 3,
    REWIND : 4
}

Player.init = function()
{
    var success = true;
          alert("success vale :  " + success);    
    this.state = this.STOPPED;
    
    this.plugin = document.getElementById("pluginPlayer");
    
    if (!this.plugin)
    {
         alert("success vale this.plugin :  " + success);    
         success = false;
    }
    
	
    alert("success vale :  " + success);    
    
    this.setWindow();
    
    alert("success vale :  " + success);    
    
    this.plugin.OnCurrentPlayTime = 'Player.setCurTime';
    this.plugin.OnStreamInfoReady = 'Player.setTotalTime';
    this.plugin.OnBufferingStart = 'Player.onBufferingStart';
    this.plugin.OnBufferingProgress = 'Player.onBufferingProgress';
    this.plugin.OnBufferingComplete = 'Player.onBufferingComplete';
	this.plugin.onServerError = 'Player.onServerError';
	this.plugin.OnNetworkDisconnected = 'Player.OnNetworkDisconnected';
    this.plugin.OnRenderingComplete ='Player.onRenderingComplete';
	
    alert("success vale :  " + success);       
    return success;
}

Player.deinit = function()
{
      alert("Player deinit !!! " );       
      
      if (this.plugin)
      {
            //this.plugin.Stop();
			Player.stopVideo();
      }
}
/* -------------------------------- Change player position ********* */
Player.setWindow = function()
{
    this.plugin.SetDisplayArea(458, 60, 472, 270);
}

Player.setFullscreen = function()
{
    this.plugin.SetDisplayArea(0, 0, 960, 540);
}

/* -------------------------------- Change player position ********* */

Player.setVideoURL = function(url)
{
    this.url = url;
    alert("URL = " + this.url);
}

Player.playVideo = function()
{
    if (this.url == null)
    {
        alert("No videos to play");
    }
    else
    {
        this.state = this.PLAYING;
        document.getElementById("play").style.opacity = '0.2';
        document.getElementById("stop").style.opacity = '1.0';
        document.getElementById("pause").style.opacity = '1.0';
        document.getElementById("forward").style.opacity = '1.0';
        document.getElementById("rewind").style.opacity = '1.0';
        Display.status("Play");
		document.getElementById("videoBox_center").style.display = "none";
        this.setWindow();
        this.plugin.Play( this.url );
        Audio.plugin.SetSystemMute(false); 
    }
}

Player.pauseVideo = function()
{
    this.state = this.PAUSED;
    document.getElementById("play").style.opacity = '1.0';
    document.getElementById("stop").style.opacity = '1.0';
    document.getElementById("pause").style.opacity = '0.2';
    document.getElementById("forward").style.opacity = '0.2';
    document.getElementById("rewind").style.opacity = '0.2';
    Display.status("Pause");
	loading.hide();
    this.plugin.Pause();
}

Player.stopVideo = function()
{
    if (this.state != this.STOPPED)
    {
        this.state = this.STOPPED;
        document.getElementById("play").style.opacity = '1.0';
        document.getElementById("stop").style.opacity = '0.2';
        document.getElementById("pause").style.opacity = '0.2';
        document.getElementById("forward").style.opacity = '0.2';
        document.getElementById("rewind").style.opacity = '0.2';
        Display.status("Stop");
        loading.hide();
		this.plugin.Stop();
        Display.setTime(0);
		document.getElementById("videoBox_center").style.display = "block";
        if (this.stopCallback)
        {
            this.stopCallback();
        }
    }
    else
    {
        alert("Ignoring stop request, not in correct state");
    }
}

Player.resumeVideo = function()
{
    this.state = this.PLAYING;
    document.getElementById("play").style.opacity = '0.2';
    document.getElementById("stop").style.opacity = '1.0';
    document.getElementById("pause").style.opacity = '1.0';
    document.getElementById("forward").style.opacity = '1.0';
    document.getElementById("rewind").style.opacity = '1.0';
    Display.status("Play");
    this.plugin.Resume();
}

Player.skipForwardVideo = function()
{
    this.skipState = this.FORWARD;
    this.plugin.JumpForward(20);
}

Player.skipBackwardVideo = function()
{
    this.skipState = this.REWIND;
    this.plugin.JumpBackward(20);
}

Player.getState = function()
{
    return this.state;
}

// Global functions called directly by the player 

Player.onBufferingStart = function()
{
	loading.show();
    Display.status("Buffering...");
	switch(this.skipState)
    {
        case this.FORWARD:
            document.getElementById("forward").style.opacity = '0.2';
            break;
        
        case this.REWIND:
            document.getElementById("rewind").style.opacity = '0.2';
            break;
    }
}

Player.onBufferingProgress = function(percent)
{
    Display.status("Buffering:" + percent + "%");
}

Player.onBufferingComplete = function()
{
	loading.hide();
    Display.status("Play");
	switch(this.skipState)
    {
        case this.FORWARD:
            document.getElementById("forward").style.opacity = '1.0';
            break;
        
        case this.REWIND:
            document.getElementById("rewind").style.opacity = '1.0';
            break;
    }
}

Player.setCurTime = function(time)
{
    Display.setTime(time);
}

Player.setTotalTime = function()
{
    Display.setTotalTime(Player.plugin.GetDuration());
}

Player.onServerError = function()
{
    Display.status("Server Error!");
}

Player.OnNetworkDisconnected = function()
{
    Display.status("Network Error!");
}

Player.onRenderingComplete = function() {
	Player.stopVideo();

}

getBandwidth = function(bandwidth) { alert("getBandwidth " + bandwidth); }

onDecoderReady = function() { alert("onDecoderReady"); }

onRenderError = function() { alert("onRenderError"); }

stopPlayer = function()
{
    Player.stopVideo();
}

setTottalBuffer = function(buffer) { alert("setTottalBuffer " + buffer); }

setCurBuffer = function(buffer) { alert("setCurBuffer " + buffer); }

