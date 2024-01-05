@verbatim
<?php

	use Illuminate\Support\Facades\DB;
	
	$items = DB::table('teams')->
			get()->toArray();
			
	$result = [];

	foreach ($items as $item){
		$item = (array)$item;
		$st = DB::table('rating')->where('team_id', $item['id'])->get();
		$points = 0;
		$count = 0;
		foreach ($st as $s){
			$points += $s->score;
			$count++;
		}
		$count = $count > 0 ? $count : 1;
		$item['points'] = round($points/$count, 2);
		$item['count'] = $count;
		$result[] = $item;
	}
	
	$result = array_reverse(orderBy($result, 'points, desc'));
	
	function orderBy(array &$array, $sortOrder){
		usort($array, function ($a, $b) use ($sortOrder) {
			$result = '';

			$sortOrderArray = explode(',', $sortOrder);
			foreach ($sortOrderArray AS $item) {
				$itemArray = explode(' ', trim($item));
				$field = $itemArray[0];
				$sort = !empty($itemArray[1]) ? $itemArray[1] : '';

				$mix = [$a, $b];
				if (!isset($mix[0][$field]) || !isset($mix[1][$field])) {
					continue;
				}

				if (strtolower($sort) === 'desc') {
					$mix = array_reverse($mix);
				}

				if (is_numeric($mix[0][$field]) && is_numeric($mix[1][$field])) {
					$result .= ceil($mix[0][$field] - $mix[1][$field]);
				} else {
					$result .= strcasecmp($mix[0][$field], $mix[1][$field]);
				} 
			}

			return $result;
		});

		return $array;
	}

?>

<html>
    <head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
		<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,500;0,600;0,800;0,900;1,200&family=PT+Sans+Caption:wght@400;700&display=swap" rel="stylesheet">
		<script src="/js/jtmpl.js"></script>
		<link href="/css/styles.css" rel="stylesheet"/>
		
		<script>
			
			var teams = {
				<?php $num=0; ?>
				<?php foreach ($result as $team) { ?>
					<?php $num++; ?>
					<?php echo $num; ?>: {
						position: <?php echo  $num; ?>,
						name: '<?php echo $team['title']; ?>',
						points: <?php echo $team['points']; ?>,
						id: <?php echo $team['id']; ?>
					},
				<?php } ?>
			}
			
			var count = <?php echo  $num; ?>
			
		</script>
		
    </head>

    <body>
	
		<script id="teamTpl" type="text/x-jquery-tmpl">
			<div class="item item-${item.id} pos-${item.position}" data-id="${item.id}" data-points="${item.points}" data-position="${item.position}" data-start="${item.position}">
				<div>
					<span class="position">${item.position}</span>
					<span class="change empty"></span>
					${item.name}
					<div class="points-cont">
					<span class="points">${item.points}</span>
					<span class="add"></span>
					<span class="summ">${item.points}</span>
					</div>
				</div>
			</div> 
		</script>
		
		<script id="columnTpl" type="text/x-jquery-tmpl">
			<div class="list-column">
			</div>
		</script>
		
		<script id="listTpl" type="text/x-jquery-tmpl">
			<div class="list">
				{{each(index, item) items}}
					{{tmpl({item: item}) '#teamTpl'}}
				{{/each}}
			</div>
		</script>

		<div class="list">
			
		</div>
        <script src="/js/rating.js"></script>
    </body>
</html>
@endverbatim