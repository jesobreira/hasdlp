<?php
ob_start();
header("Content-type: text/plain; charset=ANSI");

$glob = glob("txt/*.*");
$i = 0;
foreach($glob as $f) {
	
	$i++;
	
	$hino = (int)str_replace("HA", null, basename($f));
	if(file_exists("output/$hino.xml")) unlink("output/$hino.xml");
	
	echo "Processando hino $hino\r\n";
	flush();
	ob_flush();
	
	$get = file_get_contents($f);
	
	$titulo = trim(substr($get, 0, strpos($get, "\r\n")));
	
	$estrofes = explode("\r\n\r\n", str_replace($titulo."\n\r", null, $get));
	
	$model = file_get_contents("model.xml");
	
	$model = str_replace("%TITLE%", $hino.' - '.$titulo, $model);
	
	// versos
	$estr = 'a';
	$es_tags = null;
	foreach($estrofes as $e) {
		if(!$e) continue;
		$es_tags .= '<verse name="v1'.$estr.'">
      <lines><![CDATA[
		'.trim($e).'
	  ]]></lines>
    </verse>'."\r\n";
	++$estr; // proxima letra do alfabeto
	}
	
	$model = str_replace("%VERSES%", $es_tags, $model);
	
	file_put_contents("output/$hino.xml", $model);
}
