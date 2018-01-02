/*global tau */
(function () {
	function createListItem(name, price) {
		var span = document.createElement('span');
		span.className = 'ui-li-sub-text li-text-sub';
		span.innerHTML = price;

		var div = document.createElement('div');
		div.className = 'ui-marquee ui-marquee-gradient';
		div.innerHTML = name;

		var li = document.createElement('li');
		li.className = 'li-has-2line';
		li.appendChild(div);
		li.appendChild(span);

		return li;
	}

	function parseResponse(client, list) {
		console.log('-- parseResponse(' + client.readyState + ',' + client.status + ') --');
		if (client.readyState !== 4 || client.status !== 200) {
			return;
		}

		var root = new DOMParser().parseFromString(client.response, 'text/html').body;
		list.appendChild(createListItem(root
				.querySelector('#imTextObject_3_04_tab0 span')
				.innerHTML
				.replace(/[^0-9.]/g, ''), ''));

		var tr = root.getElementsByTagName('tr');
		for (var i = 0; i < tr.length; i++) {
			var price = tr[i].getElementsByClassName('fs12 cf2 ff1')[0];
			var name = tr[i].getElementsByClassName('fs14 cf2')[0];
			if (name && price) {
				console.log(name.innerHTML);
				console.log(price.innerHTML);
				list.appendChild(createListItem(name.innerHTML, price.innerHTML));
			}
		}

		if (tau.support.shape.circle) {
			if (list) {
				tau.helper.SnapListMarqueeStyle.create(list, {
					marqueeDelay: 250,
					marqueeStyle: 'endToEnd'
				});
				tau.widget.SnapListview(list);
			}
		}
	}

	document.addEventListener('pagecreate', function (event) {
		var page = event.target;
		console.log('-- pagecreate(' + page.id + ') --');

		var list = page.querySelector('.ui-listview');
		if (!list) {
			return;
		}

		// Clear list
		list.innerHTML = '';

		var client = new XMLHttpRequest();
		client.onreadystatechange = parseResponse.bind(this, client, list);
		client.open('GET', 'http://volynka.cz/denni-menu.html', true);
		client.send();
	});

	window.addEventListener('tizenhwkey', function (event) {
		var activePopup = null,
			page = null,
			pageid = '';

		if (event.keyName === 'back') {
			activePopup = document.querySelector('.ui-popup-active');
			page = document.getElementsByClassName('ui-page-active')[0];
			pageid = page ? page.id : '';

			if (pageid === 'main' && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {}
			} else {
				window.history.back();
			}
		}
	});
}());