<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache'); // recommended to prevent caching of event data.

$id = time();

for ($i = 0; $i < 10; $i++) {
	$msg = file_get_contents('./test.json');
	$msg = explode("\n", $msg);

	echo "event: log" . PHP_EOL;
	echo "data: " . $msg[rand() % count($msg)] . PHP_EOL;
	echo PHP_EOL;
	ob_flush();
	flush();
}
