<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
	<title>Whisperer</title>

	<!-- Bootstrap -->
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">

	<!-- Optional theme -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">

	<style type="text/css">
		#keyName {
			text-align: right;
		}

		.host {
			font-family: 'DejaVu Sans Mono', monospace;
			font-size: 12px;
		}

		.group {
			font-family: 'DejaVu Sans Mono', monospace;
			font-size: 12px;
		}
	</style>
</head>
<body>
<div class="container">
	<div class="row">
		<div class="row-md-12">
			<h1>Whisperer</h1>
		</div>
	</div>

	<div class="row">
		<div class="row-md-12">
			<p>Sample text</p>

			<center>
				<form class="form-inline form-group-lg">
					<div class="form-group">
						<label class="sr-only" for="keyName">Email address</label>
						<input type="text" size="10" class="form-control" id="keyName" placeholder="Key">
					</div>
					<div class="form-group">=</div>
					<div class="form-group">
						<input type="text" size="40" class="form-control" id="expectedValue" placeholder="Expected value">
					</div>
					<button type="submit" class="btn btn-primary btn-lg">Track!</button>
				</form>
			</center>

			<table class="table">
				<thead>
				<tr>
					<th>Host</th>
					<th>Group</th>
					<th>Thread</th>
					<th>Message</th>
				</tr>
				</thead>

				<tbody>
				<tr class="entry">
					<td class="host">search-coord2</td>
					<td class="thread">search-coord2</td>
					<td class="group">com.farpost.search.web.RestControllerV13</td>
					<td>com.farpost.search.TimeoutException: Timeout while querying document storage</td>
				</tr class="entry">
				<tr>
					<td class="host">search-coord2</td>
					<td class="thread">search-coord2</td>
					<td class="group">com.farpost.search.web.RestControllerV13</td>
					<td>com.farpost.search.TimeoutException: Timeout while querying document storage</td>
				</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
</body>
</html>