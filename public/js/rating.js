var column_items_count = 15

var result = {
}

var keys = [];

	var list = {}
	var items = {}

$(document).ready(function(){
	
	for (key in teams){
		keys.push(teams[key].id)
	}
	
	list_container = $('.list')
	createList(teams)
	items = $('.item')
	items.each(function(){
		$(this).css({
			'left': $(this).offset().left,
			'top': $(this).offset().top
		})	
	})
	items.css('position', 'absolute')
	
	loadData()
	
})

function loadData(){
	$.get('https://kod06.ru/getpoints', function(data){
		
		data = JSON.parse(data)
		if (data.length < 1){
			setTimeout(function(){
				loadData()
			}, 5000)
			return false
		}
		
		result = data
		startAnimate()
		
	})
}

function startAnimate(){
	
	var current = 0
	//moveElement(teams[24])
	//return false
	var interval = setInterval(function(){
		current++
		if (current > count){
			clearInterval(interval)
			return false
		}
		console.log(count, current, keys[count-current])
		if (result[teams[keys[count-current]].id] == undefined)
			inc = 0
		else{
			inc = result[teams[keys[count-current]].id]
		}
		if (current > count){
			clearInterval(interval)
			return false
		}

		items.removeClass('active')
		moveElement(teams[keys[count-current]], inc)
	}, 2000)
	
}

function moveElement(item, inc){
	
	elem = $('.item-'+item.id)
	elem.addClass('active')
	let new_rank = getRank(item.points, inc)

	item.points = item.points + inc
	elem.find('.add').text('+'+inc)
	elem.find('.position').text(new_rank)
	elem.find('.summ').text(item.points)

	let ch = elem.find('.change')
	ch.removeClass('empty')
	let diff = Math.abs(new_rank - elem.data('start'))
	
	if (new_rank > elem.data('start')){
		ch.removeClass('up').addClass('down').text(-1*diff)
	}else if (new_rank < elem.data('start')){
		ch.removeClass('down').addClass('up').text('+'+diff)
	}else{
		ch.removeClass('down').removeClass('up').addClass('neutral').text('=')
	}
	elem.addClass('moved')
	elem.addClass('done')
	let coords = getNewCoords(item.position, new_rank)
	item.old_rank = item.position
	item.position = new_rank
	// if (!coords){
		// elem.removeClass('moved')
		// return true
	// }

	setTimeout(function(){
		startMove(elem, coords)
		for (let i = new_rank; i < item.old_rank; i++){
			sub_elem = items.filter('[data-position='+i+']')
			sub_elem.find('.position').text((i+1))
			current_item = getElemById(sub_elem.data('id'))
			coords = getNewCoords(i, i+1)
			current_item.old_rank = current_item.position
			current_item.position = current_item.position >= count ? current_item.position : i + 1
			
			let ch = sub_elem.find('.change')
			ch.removeClass('empty')
			let diff = Math.abs((i+1) - sub_elem.data('start'))
			if ((i+1) > sub_elem.data('start')){
				ch.removeClass('up').addClass('down').text(-1*diff)
			}else if ((i+1) < sub_elem.data('start')){
				ch.removeClass('down').addClass('up').text('+'+diff)
			}else{
				ch.removeClass('down').removeClass('up').addClass('neutral').text('=')
			}
			
			startMove(sub_elem, coords)
			sub_elem.removeClass('pos-'+i)
			sub_elem.addClass('pos-'+(i+1))
		}
		
		for (key in teams){
			items.filter('.item-'+teams[key].id).attr('data-position', teams[key].position)
		}
		
		elem.removeClass('pos-'+item.old_rank)
		elem.addClass('pos-'+new_rank)
	}, 800)
	
	// console.log(new_rank, item.old_rank)
	
	
}

function getElemById(id){
	
	for (key in teams){
		if (teams[key].id == id){
			return teams[key]
			break
		}
	}
}

function startMove(elem, coords){
	
	elem.css({
		'left': elem.offset().left,
		'top': elem.offset().top
	})	
	
	setTimeout(function(){
		elem.css({
			'left': coords.x,
			'top': coords.y
		})
	}, 10)
	
	setTimeout(function(){
		elem.removeClass('moved')
	}, 210)
	
	
	
}

function getNewCoords(current_rank, new_rank){
	if (current_rank == new_rank){
		return false
	}
	
	return {
		x: $('.pos-'+new_rank).offset().left,
		y: $('.pos-'+new_rank).offset().top
	}
}

function createList(items){
	let current = 0
	let count = 0
	
	for (key in items) {
		count++
		if (count > 30){
			column_items_count = 17
		}
		
		item = items[key]
		
		if (current === 0){
			var list_column = $('#columnTpl').tmpl()
		}
		
		list_column.append($('#teamTpl').tmpl({item: item}))
		
		current++
		
		if (current == column_items_count){
			$('.list').append(list_column)
			list_column = false
			current = 0
		}
		
	}
	
	if (current < column_items_count){
			$('.list').append(list_column)
			list_column = false
			current = 0
	} 
}

function getRank(current, inc){
	
	let new_rank = 1
	
	let points = current + inc
	
	for (key in teams) {
		
		item = teams[key]
		
		if (item.points > points){
			new_rank++
		}
		
	}
	
	return new_rank > count ? count : new_rank
	
}

function getColumn(rank){
	
	return Math.ceil(rank/column_items_count)
	
}