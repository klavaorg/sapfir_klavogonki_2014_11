var game;
var params = {};

var __same_chars = ['ё','е',
                    'Ё', 'Е',
                  '«', '"',
                  '»', '"',
                  '—', '-',
                  '–', '-'];

var tplAnonymPlayer = new Template('\
<div class="player #{you}" id=player#{id}>\
<div class="newrecord" id="newrecord#{id}" style="display: none"></div>\
<div class=rating id=rating#{id} style="display: none;"></div>\
#{rating_loading_html}\
<table class="car" id=car#{id}><tr>\
<td class="name">\
#{name}\
</td>\
<td>\
<div class=imgcont id=imgcont#{id}>\
<div class="img car1" style="background-color: #777777"></div>\
</div>\
</td>\
</tr>\
</table>\
<div class=divider><img src="/img/blank.gif"></div>\
</div>\
');
var tplUserPlayer = new Template('\
<div class="player #{you}" id=player#{id}>\
<div class="newrecord" id="newrecord#{id}" style="display: none">\
<span ng:show="PlayersList.records[#{user.id}] !== undefined">\
    <a ng:show="PlayersList.records[#{user.id}]" ng:click="PlayersList.onOpenPost(PlayersList.records[#{user.id}])" app:jq="tipsy" title="Нажмите для просмотра">Рекорд!</a>\
    <a ng:hide="PlayersList.records[#{user.id}]" class="nopost">Рекорд!</a>\
</span>\
<a ng:show="PlayersList.achieves[#{user.id}]" ng:click="PlayersList.onOpenPost(PlayersList.achieves[#{user.id}])" app:jq="tipsy" title="Нажмите для просмотра">Достижение!</a>\
<a ng:show="PlayersList.typestats[#{id}]" ng:click="PlayersList.onOpenTsf(#{user.id},#{game_id})" class="typestats">ПОДТВЕРЖДЕНО</a>\
</div>\
<div class=rating id=rating#{id} style="display: none;"></div>\
#{rating_loading_html}\
<table class="car" id=car#{id}><tr>\
<td class="name">\
<div class="name_content">\
<table><tr>\
<th>#{avatar_html}</th>\
<td>\
<div class="nick_content">\
<a href="/profile/#{user.id}/" class="#{user.colored_rang} profile" onmousemove="showProfilePopup(#{user.id});" onmouseover="showProfilePopup(#{user.id});" onmouseout="hideProfilePopup(#{user.id});">\#{name}</a>\
</div></td>\
</tr></table>\
</div>\
</td>\
<td>\
<div style="position: relative;">\
<div class=imgcont id=imgcont#{id} style="background: #{user.background}">\
<div class="img car#{user.car} car-base_#{user.tuning[0]}" style="background-color: transparent; color: #{color}">\
<div class="img car#{user.car} car-tuning car-tuning1_#{user.tuning[1]}">\
<div class="img car#{user.car} car-tuning car-tuning2_#{user.tuning[2]}">\
<div class="img car#{user.car} car-tuning car-tuning3_#{user.tuning[3]}"></div>\
</div>\
</div>\
</div>\
#{rating_html}\
#{award_html}\
</div>\
</div>\
</td>\
</tr>\
</table>\
<div class=divider><img src="/img/blank.gif"></div>\
</div>\
');
var tplRatingWAwardPlayer = new Template('<div title="Позиция в недельной таблице" class=car_rating style="color: #{color}; padding-right: 14px;"><span class=bitless2>№</span>#{ratingPos}</div>');
var tplRatingPlayer = new Template('<div title="Позиция в недельной таблице" class=car_rating style="color: #{color};"><span class=bitless2>№</span>#{ratingPos}</div>');
var strAwardPlayer = {
		1: '<i class="award award1" border=0 title="Медаль за 300 текстов пробега"></i>',
		2: '<i class="award award2" border=0 title="Звезда за 1000 текстов пробега"></i>',
		3: '<i class="award award3" border=0 title="Кубок за 2000 текстов пробега"></i>',
		4: '<i class="award award4" border=0 title="Корона за 5000 текстов пробега"></i>',
		5: '<i class="award award5" border=0 title="Золотой шлем за 10000 текстов пробега"></i>',
		6: '<i class="award award6" border=0 title="Бриллиантовый шлем за 20000 текстов пробега"></i>'
};

var tplRating = new Template('\
<div><ins id=place#{id} class="place place#{place}">#{place} место</ins><ins id=rating_gained#{id}></ins></div> \
#{delresult}\
<div class=stats id=stats#{id}>\
<div><span class=bitmore><span class=bitmore>#{time}</span></span>#{time_decimal}</div>\
<div>\
<span class=bitmore><span class=bitmore>#{speed}</span></span> <span id=znmin#{id}>зн/мин</span>\
</div>\
<div>#{errors_html}</div>\
</div>\
');

var tplRatingGained = new Template('<ins id=rating_gained#{id} class=rating_gained>+#{rating_gained}</ins>');

var tplTypetextLine = new Template('\
<span class=#{hidden}>\
<span id=typefocus class=#{highlight}>#{focus}</span>\
<span id=afterfocus>#{after}</span>\
</span>\
');

var tplTypetextFull = new Template('\
<span class=#{hidden}>\
<span id=beforefocus>#{before}</span>\
<span id=typefocus class=#{highlight}>#{focus}</span>\
<span id=afterfocus>#{after}</span>\
</span>\
');

var tplMarathonThis = new Template('<a class=marathon_this href="/g/#{id}.marathon-this">Марафон</a>');

var tplBook = {
	book: new Template('\
	Вы набирали цитату из книги:\
	<div class=name>#{textinfo.author} &laquo;#{textinfo.name}&raquo;</div>'),
	
	/*ozon: new Template('\
	Вы набирали цитату из книги:\
	<table id=ozon>\
	<tr>\
	<th><a target=_top href="http://www.ozon.ru/context/detail/id/#{textinfo.tag}/?partner=klavogonki" target=_blank><div class=book-border><img src="/ozon_img/#{textinfo.tag}.jpg"></div></a></th>\
	<td>\
	<div class=name>#{textinfo.author}<br>\
	&laquo;<a target=_top href="http://www.ozon.ru/context/detail/id/#{textinfo.tag}/?partner=klavogonki" target=_blank>#{textinfo.name}</a>&raquo;</div>\
	</td></tr></table>'),*/
	
	ozon: new Template('\
		<table id=book>\
		<tr>\
		<th>\
		<a target=_top href="http://www.ozon.ru/context/detail/id/#{textinfo.tag}/?partner=klavogonki" target=_blank><div class=book-border><img src="/ozon_img/#{textinfo.tag}.jpg"></div></a>\
		</th>\
		<td>\
			<div>Вы набирали цитату из книги:</div>\
			<div class=author>#{textinfo.author}</div>\
			<div class=name><a target=_blank href="http://www.ozon.ru/context/detail/id/#{textinfo.tag}/?partner=klavogonki">#{textinfo.name}</a></div>\
		</td>\
		</tr></table>'),
	
	ozon_nolink: new Template('\
			<table id=book>\
			<tr>\
			<th>\
			<div class=book-border><img src="/ozon_img/#{textinfo.tag}.jpg"></div>\
			</th>\
			<td>\
				<div>Вы набирали цитату из книги:</div>\
				<div class=author>#{textinfo.author}</div>\
				<div class=name>#{textinfo.name}</div>\
			</td>\
			</tr></table>'),
	
	imobilco: new Template('\
		<table id=book class="imobilco">\
		<tr>\
		<th>\
			<div class="imobilco-container">\
			<a target=_blank href="http://www.imobilco.ru/books/-/#{textinfo.tag}/?from-partner=klavogonki">\
			<div class="imobilco-book">\
			<span class="imobilco-cover"><span class="co itl"></span><span class="co itr"></span><span class="co ibl"></span><span class="co ibr"></span></span>\
			<img src="/imobilco_img/#{textinfo.tag}.jpg">\
			</div>\
			</a>\
			</div>\
		</th>\
		<td>\
			<div>Вы набирали цитату из книги:</div>\
			<div class=author>#{textinfo.author}</div>\
			<div class=name><a target=_blank href="http://www.imobilco.ru/books/-/#{textinfo.tag}/?from-partner=klavogonki">#{textinfo.name}</a></div>\
			<div class=imobilco-link><a target=_blank href="http://www.imobilco.ru/books/-/#{textinfo.tag}/?from-partner=klavogonki">Скачать книгу</a>#{marathon_this_html}</div>\
		</td>\
		</tr></table>'),
		
	imobilco_nolink: new Template('\
			<table id=book class="imobilco">\
			<tr>\
			<th>\
				<div class="imobilco-container">\
				<div class="imobilco-book">\
				<span class="imobilco-cover"><span class="co itl"></span><span class="co itr"></span><span class="co ibl"></span><span class="co ibr"></span></span>\
				<img src="/imobilco_img/#{textinfo.tag}.jpg">\
				</div>\
				</div>\
			</th>\
			<td>\
				<div>Вы набирали цитату из книги:</div>\
				<div class=author>#{textinfo.author}</div>\
				<div class=name>#{textinfo.name}</div>\
			</td>\
			</tr></table>'),
	
	news: new Template('\
	Вы набирали цитату из новости с сайта:\
	<div class=name>\
	<a target=_blank href="/g/#{id}.goto">\
	<i style="background: transparent url(/sources/#{textinfo.source.id}.gif) no-repeat 0% 0%;"></i>\
	#{textinfo.source.name}\
	</a>\
	</div>')
	
	};
			

var tplBookinfoNormal = new Template('\
#{book_html}\
<div class=bar></div>\
<table id=again><tr>\
<td align=right><span class=hotkey>&larr; Ctrl</span><a href="javascript:void(0);" onclick="if(typeof chatLeaveRoom != \'undefined\') chatLeaveRoom(\'game#{id}\'); window.location=\'/g/#{id}.gogamelist\';">К списку игр</a></td>\
<td align=left><a href="javascript:void(0);" onclick="if(typeof chatLeaveRoom != \'undefined\') chatLeaveRoom(\'game#{id}\'); window.location=\'/g/#{id}.replay\';">Играть еще раз</a><span class=hotkey>Ctrl &rarr;</span><br><span class=note>в этом же режиме</span></td>\
</tr></table>\
');
var tplBookinfoPractice = new Template('\
#{book_html}\
<div class=bar></div>\
<div id=again><a title="Горячая клавиша: Ctrl &rarr;" href="javascript:void(0);" onclick="if(typeof chatLeaveRoom != \'undefined\') chatLeaveRoom(\'game#{id}\'); window.location=\'/g/#{id}.replay\';">Играть еще раз</a><span class="hotkey alone">Ctrl &rarr;</span></div>\
');
var tplBookinfoPrivate = new Template('\
#{book_html}\
');
var tplBookinfoPrivateHost = new Template('\
#{book_html}\
<div class=bar></div>\
<div id=again><a title="Горячая клавиша: Ctrl &rarr;" href="javascript:void(0);" onclick="if(typeof chatLeaveRoom != \'undefined\') chatLeaveRoom(\'game#{id}\'); window.location=\'/g/#{id}.replay\';">Играть еще раз</a><span class="hotkey alone">Ctrl &rarr;</span>\
<br><span class="bitless">(Другие игроки будут приглашены автоматически)</span></div>\
');

var tplReplay = new Template('\
Игрок #{hostname} приглашает вас сыграть еще раз. <a href="/g/?gmid=#{id}">Присоединиться</a>\
');

var tplChatAnonymPlayer = new Template('<span style="color: #{color}">#{name}</span>');
var tplChatUserPlayer = new Template('\
<span style="display: inline; #{avatar_html} color: #{color}">#{name}</span>\
');
var tplChatMessage = {
	me: new Template('<li id=message_num_#{num}> <span class=message_time>#{time}</span> <span class=message_player>#{player_html}</span> <span class=message_text>#{text}</span></li>'),
	normal: new Template('<li id=message_num_#{num}> <span class=message_time>#{time}</span> <span class=message_player>#{player_html}</span>: <span class=message_text>#{text}</span></li>'),
	system: new Template('<li id=message_num_#{num} style="color: #999;"> <span class=message_time>#{time}</span> <span class=message_player>Игрок #{player_html}</span> <span class=message_text>#{text}</span></li>')
};
var tplChatUserAvatar = new Template('background: url(#{avatar}) no-repeat left; padding-left: 20px;');

var tplDropMessageNewLevel = new Template('<h4 style="color: #b38f00">Новый уровень!</h4>\
										  <p>Поздравляем! Вы достигли <strong>#{level}-го уровня</strong>!<br/>\
										  	Вам начислено #{bonuses} бонусов.</p>');

var strLoading = '<img src="/img/loading.gif"><br><span class=orange>Загрузка</span>';
var strCheat = '<div align=center><div class=msg><div><p>Игра заблокирована из-за попытки мошенничества.</p>\
<p>Если вы действительно нашли способ обмануть игру, отлично! Может теперь, когда вы достигли своей цели, стоит попрактиковаться в настоящем наборе?</p>\
<p>Если вы видите это сообщение по ошибке, обратитесь по адресу <a href="mailto:mail@typeracer.ru">mail@typeracer.ru</a></p></div></div>';
var strCaptchaOK = '<div align=center><p>Спасибо, тест успешно пройден. Ваш результат зачислен.</p><input type=button class=btn value="Закрыть" onclick="$(\'captcha\').hide();"></div>';
var strCaptchaFail = '<div align=center><p>Тест пройден неверно. Попробуйте в следующий раз.</p><input type=button class=btn value="Закрыть" onclick="$(\'captcha\').hide();"></div>';
var strRatingLoading = '<div id=rating_loading style="display: none;">Результат засчитан. Подождите...</div>'; 
var strRatingFail = 'Игрок сошел с трассы';

var tplSkiptrackerrorFail = new Template('\
		<div>Результат не зачтен</div> \
		<div>#{errors_html}</div>\
		');

var profilesCache = Array();
var chatFocused = false;
var cachedUsers = new Object();
var inputtext_focused = false;

var ufopos = 0;
var ufostr = '';

var speedpanel_top_loaded = false, speedpanel_arrow_loaded = false, speedpanel_back_loaded = false;

Class.Methods.toArray = function()
{
	return 'asd';
}


var Player = Class.create
({
	initialize: function(info)
	{
		this.pos = 0;	
		
		var cookie;
		if(url_suffix && Prototype.Browser.IE)
		{
			var m = game.cookies.match(/player!!!(\d+),[a-z0-9]+@@@/);
			if(m && m[1] == info.id)
				this.you = true;
		}
		if(cookie = getCookie('player'))
		{
			var m = cookie.split(',');			
			if(m[0] == info.id)			
				this.you = true;
		}	
		
		
		this.move_effect = {state: 'finished'};
		this.update(info);
	},		 
	setPos: function(pos)
	{
		tlog("Player::setPos "+this.info.id, {pos: pos});
		this.pos = pos;	
		$('car'+this.info.id).style.top = 0;
		
		var w = url_suffix?380:480;
		var x = Math.floor(pos * w / (game.params.qual ? game.wordsTotal : game.errorWork ? game.original_words.length : game.words.length) );		
		if(game.custom && game.params.mode=='marathon')
		{
			x = Math.floor(pos * w / game.marathon_length);
			if(game.finished)
				x = w;
		}	
		
		if(game.custom && game.params.gametype == 'noerror' && this.info.errors>1)
		{
			this.errorKick();
		}		
		else if(this.info.skiptrackerror_kicked) {
			
			$('rating_loading').hide();
			var rating = $('rating'+this.info.id);
			rating.update(tplSkiptrackerrorFail.evaluate(this.info));
			rating.show();
			$('car'+this.info.id).setStyle({left: '480px'});
			
		}
		else if(pos)
		{
			if(params.carmove == 'smooth' && (!game.params || !game.params.regular_competition))
			{
				if(this.move_effect.state != 'finished')
					this.move_effect.cancel();
							
				this.move_effect = new Effect.Move($('car'+this.info.id), {x: x, y: 0, mode: 'absolute'});
			}
			else
				$('car'+this.info.id).setStyle({left: x+'px', top: 0});
		}		 
				  
	},
	errorKick: function()
	{		
		var rating = $('rating'+this.info.id);
		rating.update(strRatingFail);
		rating.show();
		$('car'+this.info.id).setStyle({left: '480px'});
	},
	
	dump: function()
	{
		if(!__testmode)
			return null;
		
		var result = {};
		for(var i in this)
		{			
			if(typeof this[i] != 'function' && typeof this[i] != 'object')
				result[i] = this[i];
		}
		result.info = this.info;
		return result;
	},
	update: function(info)
	{
		tlog("Player::update "+(this.info ? this.info.id : '?'), {that: this.dump(), info: info});
				
		if(this.info && info.v <= this.info.v)
			return;
		
		this.tpl = tplAnonymPlayer;

        info.game_id = game.id;
		
		// кэш юзеров
		if(info.user !== null)
		{
			if(typeof info.user == 'object')
				cachedUsers[info.user.id] = info.user;
			if(typeof info.user == 'number')
				info.user = cachedUsers[info.user];
		}
		
		if(info.user)
			this.tpl = tplUserPlayer;
			
		var oldinfo = clone(this.info);	
		
			
		this.info = clone(info);
		this.info.you = 'other';
		if(this.you)
			this.info.you = 'you';
			
		if(this.info.user)
		{
			this.info.color = '#000000';
			if(/#[a-fA-F0-9]+/.test(this.info.user.color))
				this.info.color = colortools.capByBrightness(this.info.user.color);
				
			if(info.leave && Prototype.Browser.Opera)
				this.info.user.background = 'white';
		}			
		
		//this.info.opacity = (oldinfo && oldinfo.leave) ? 0.3 : 1.0;
					
		if(this.info.avatar)
			this.info.avatar_html = '<img src="'+this.info.avatar+'">';

		if(this.info.user)
		{
			/*if( this.info.user.ext == 'vk' && !__vk)
				this.info.avatar_html = '<img src="/img/vk_icon.gif">';*/
			this.info.award_html = '';
			
			if(!game.params || !game.params.voc || game.params.voc.type != 'book')
			{
				if(this.info.user.num_races >= 20000)
					this.info.award_html = strAwardPlayer[6];
				else if(this.info.user.num_races >= 10000)
					this.info.award_html = strAwardPlayer[5];
				else if(this.info.user.num_races >= 5000)
					this.info.award_html = strAwardPlayer[4];
				else if(this.info.user.num_races >= 2000)
					this.info.award_html = strAwardPlayer[3];
				else if(this.info.user.num_races >= 1000)
					this.info.award_html = strAwardPlayer[2];
				else if(this.info.user.num_races >= 300)
					this.info.award_html = strAwardPlayer[1];
			}
			
			if(typeof this.info.user.rating7 == 'number' || typeof this.info.user.ratingBook == 'number')
			{
				this.info.ratingPos = typeof this.info.user.ratingBook != 'undefined' ?
										this.info.user.ratingBook+1 :
										this.info.user.rating7+1;
				if(this.info.award_html != '')
					this.info.rating_html = tplRatingWAwardPlayer.evaluate(this.info);
				else
					this.info.rating_html = tplRatingPlayer.evaluate(this.info);
			}
			
			if(!__user_prefs.no_colored_rangs)
				this.info.user.colored_rang = 'rang'+this.info.level;
		}
		
		if(this.you)
			this.info.rating_loading_html = strRatingLoading;
			
		
		if(this.you && game.params && game.params.competition && this.info.user.scores != parseInt($('userpanel-scores').innerHTML))
			new Effect.NumberChange('userpanel-scores', this.info.user.scores);
		
		if(this.you && !this.info.user)
			this.info.name = 'Это вы';
		
		
		if(this.info.ufo && this.info.level != 9)
			this.info.level = 9;

		if(game.gamestatus != 'racing' || !$('player'+info.id))
		{	
			
			if($('player'+info.id))
			{
				var new_content = this.tpl.evaluate(this.info);
				if(this.cache_content != new_content)
					$('player'+info.id).replace(new_content);
				this.cache_content = new_content;
			}
			else
			{
				
				if(this.you)
					$('players').insert({top:this.tpl.evaluate(this.info)});
				else
					$('players').insert(this.tpl.evaluate(this.info));
				
				if(params.carmove == 'smooth')
					new Effect.PlayerEnterRace('car'+this.info.id);
			}

            angularCompile(document.getElementById('player'+info.id));
				
		}
		else
		{			
			
			this.setPos(info.pos);
						
			if((this.you && info._finished || info.finished) && game.places.indexOf(info.id) == -1 && info.skiptrackerror_kicked == undefined)
			{			
				tlog('place push ok - ' + info.id);
				game.places.push(info.id);				
				game.places.sort( function (a,b) {
						if(game.custom && game.params.mode == 'marathon')
						{				
							var s1 = game.players[b].info.charsTotal;
							var s2 = game.players[a].info.charsTotal;
						}
						else
						{						  
							var s1 = game.players[a].info._finished;
							var s2 = game.players[b].info._finished;
						}
						if(s1==s2)
							return game.players[a].info.errors - game.players[b].info.errors;
						else
							return s1-s2;
					} );
			}		
		}	
		
		
				
		if(oldinfo)
		{
			if(!oldinfo.leave && info.leave)
			{
				new Effect.Opacity('imgcont'+info.id, {from: 1.0, to: 0.3, duration: 0.5});
				if(info.leave && Prototype.Browser.Opera)
					$('imgcont'+info.id).setStyle({background: 'white'});
			}
			if(oldinfo.leave && !info.leave)
			{
				new Effect.Opacity('imgcont'+info.id, {from: 0.3, to: 1.0, duration: 0.5});
				if(info.leave && Prototype.Browser.Opera)
					$('imgcont'+info.id).setStyle({background: info.user ? info.user.background : '#777'});	
			}
		}
		
				
	}
});

function inject(str,level)
{
	if(str.length<4)
		return str;
	var len = 15;
	if(str.length-2 < len)
		len = str.length-2;
	var pos = Math.random()*len+1;			
	var part1 = str.substring(0,pos);
	var part2 = inject(str.substring(pos,str.length),level+1);
	var result = part1+'</span><span style="display:none;">'+String.fromCharCode(Math.random()*30+1072)+'</span><span>'+part2;
	/*var result = part1+'<span__SPACECHAR__style="position:absolute;left:-1000px;">'+String.fromCharCode(Math.random()*30+1072)+'</span>'+part2;
	if(level == 0)
	{
		result = result.replace(/ ([^ \r\n]+)/g," <span__SPACECHAR__style='white-space:nowrap;'>$1</span>");
		result = result.replace(/__SPACECHAR__/g,' ');
		return result;
	}*/
	if(level == 0)
		return '<span>'+result+'</span>';
	else
		return result;
}

var Track = Class.create
({
	initialize: function()
	{
		this.tpl = tplTypetextLine;
		
	},
	update: function()
	{	
		if(game.params.qual)
			return;
		
		tpl = tplTypetextLine;
		$('typetext').className = 'line';
		var end = game.text.indexOf(' ',game.curWord().pos+50);
		if(params.typemode == 'full')
		{
			tpl = tplTypetextFull;
			$('typetext').className = 'full';
			end = -1;
		}
		if(end == -1)
			end = game.text.length;
			
		var word = game.curWord().word;					
		var after = game.text.substring(game.curWord().pos-1+game.curWord().word.length, end).replace('о','o','g').replace('с','c','g');
		var before = game.text.substring(0,game.curWord().pos).replace('о','o','g').replace('с','c','g');
		
		before = before.replace(/</g,'&lt;').replace(/>/g,'&gt;');
		word = word.replace(/</g,'&lt;').replace(/>/g,'&gt;');
		after = after.replace(/</g,'&lt;').replace(/>/g,'&gt;');
		
		if(params.highlight == 'symbol')
		{
			var before = before + word.substring(0,game.last_correct_char);
			var focus = word.substring(game.last_correct_char,game.last_correct_char+1);			
			var oldAfter = after;
            after = word.substring(game.last_correct_char+1);

            if(game.curWord() != game.words[ game.words.length-1 ])
                after += oldAfter;
		}
		else
		{
			word = inject(word.substring(0,word.length-1),0);
			after = inject(after,0);
			var focus = word.replace('о','o','g').replace('с','c','g');			
		}	
		
		var br = '';
		if(params.typemode != 'line')
			br = '<br>';
		before = before.replace(/\n/g,br);
		focus = focus.replace(/\n/g,br);
		after = after.replace(/\n/g,br);		
		
		
					
		var now = new Date();
		var timeout = Math.round( (game.begintime - now.getTime())/1000 );
		
		if(!game.params.qual && (game.gamestatus == 'racing' || game.gamestatus == 'waiting' && timeout <= 2))
		{	
			$('typetext').update(tpl.evaluate({
				hidden: (game.gamestatus == 'racing'  || game.gamestatus == 'waiting' && timeout <= 2 ? '' : 'hidden'), 
				before: before,
				focus: focus, 
				after: after,
				highlight: params.highlight!='off' && game.gamestatus == 'racing' ? (game.error ? 'highlight_error' : 'highlight') : ''}));				
		}
				
		
	}
	
});

var Game = Class.create
({
	initialize: function(id)
	{
		tlog('Game::initialize');
		
		this.tickRequest = {_complete: true};
		this.places = Array();
	
		this.id = id;
		this.track = new Track();
		
		this.errors = 0;
		this.error = false;
		
		this.chat_num = 0;
		this.chat_last_id = 0;
		
		this.finished = false;
		
		this.ufopos = 0;
				
		this.failTimer = setTimeout( function() { window.location = '/'; }, 1000*18*60);
		
		this.url_suffix = url_suffix;
		
		this.cookies = new String();
		
		this.last_error_pos = -1;
		this.last_correct_char = 0;
		
		this.needLine = -1;
		
		this.input_words = new Array();
		
		this.original_title = document.title;
		
		this.keypressesNum = 0;
		
		this.errors_positions = new Array();
		this.errors_map = new Array();
		for(var i=0;i<=49;i++)
			this.errors_map[i] = 0;
		this.errors_words = [];
		
		this.digramms_time = {};
		
		this.invited_list = new Array();
		
		this.charsTyped = 0;
		
		this.need_text = 1;
		setTimeout(function(){game.need_text = 0;}, 10000);
		
		this.tick_failures = 0;
		
		this.requestHeaders = {};
		
		var parameters = clone(url_params);		
		parameters.need_text = 1;
		parameters.cookies = this.cookies;
		
		new Ajax.Request('/g/'+this.id+'.info',{
			method: 'post',
			parameters: parameters,
			tries: 5,
			timeout: 20000,
			onSuccess: function(transport)
				{
					game.loadCallback(transport);
				},
			onFailure: function()
				{
					showDisconnectedPopup();
				}});		
				
		$('speedpanel-back').onload = function(){ speedpanel_back_loaded = true; };
		$('speedpanel-top').onload = function(){ speedpanel_top_loaded = true; };
		$('speedpanel-arrow').onload = function(){ speedpanel_arrow_loaded = true; };
				 
		if(__user_prefs && __user_prefs.metronome)
			metronome.initialize();
				
		var now = (new Date()).getTime();
		this.lastPCheck = {inputLength: 0, time: now};
		setInterval(function() {			
			var nowInputLength = $('inputtext').value.length;
			if(game.gamestatus == 'racing' && nowInputLength - game.lastPCheck.inputLength > 3000/60 * 300/1000) { 
																																																																							game.requestHeaders['X-Klavogonki-P'] = 1;
				// prevent default ??
																																																																							
			}
			game.lastPCheck.inputLength = nowInputLength;
			game.lastPCheck.time = (new Date()).getTime();
			
		}, 300);

	},	
	loadInfo: function(json)
	{	
		tlog("Game::loadInfo", json);
		
		var lastPos = 0;
		var now = new Date();
		
		if(json.setcookie)
		{
			for (name in json.setcookie)
			{
				var cookie = json.setcookie[name];
				if(name == 'player' && getCookie('player') && getCookie('game') == this.id)
				{
					var old_player_id = getCookie('player').split(',')[0];
					var new_player_id = cookie.value.split(',')[0];
					if(old_player_id != new_player_id && typeof(old_player_id) == 'string' && this.players && this.players[parseInt(old_player_id)])
					{		
						this.players[old_player_id].info.v = -1;
						if(json.players && json.players[old_player_id])
							json.players[old_player_id].v = 0;
						this.players[old_player_id].you = false;
					}
				}
				setCookie(name,cookie.value,null,cookie.path,cookie.domain);
				
				
				if(url_params && Prototype.Browser.IE)
					this.cookies += name+'!!!'+cookie.value+'@@@';
			}
		}
		
		this.begintimeServer = json.begintime;
		this.endtimeServer = json.endtime; 
		this.begintime = json.begintime*1000 - json.time*1000 + now.getTime();
		this.begintime_delayed = 0;		
		this.endtime = json.endtime*1000 - json.time*1000 + now.getTime();
		this.charsTotal = json.charsTotal;	
		this.wordsTotal = json.wordsTotal;
		this.type = json.type;
		if("premium_digramms" in json)
			this.premium_digramms = json.premium_digramms;
		
		if(json.text)
		{
			this.text = json.text.text;		
			this.textinfo = json.text;
		}
		if(json.custom && json.params.mode=='marathon')
		{
			this.marathon_length = json.marathon_length;
			this.nextText = json.nextText;
			this.linesPos = json.linesPos;
		}
		this.words = Array();
		this.host = json.host;
		if(this.host)
			$('host_start').show();
		this.custom = json.custom;
		
		var descstr = '<span class=gametype-normal>Обычный режим</span>, открытая игра, таймаут 30 сек';
		if(this.custom)
		{
			this.params = json.params;
			descstr = this.getGametypeName();
			if(this.params.voc && this.params.voc.type == 'book')
				descstr += ', '+(this.textinfo.part || 1)+'-й отрывок';
			if(this.params.competition)
			{
				descstr += ', соревнование';
				if(this.params.regular_competition)
					descstr += ' (x'+this.params.regular_competition+')';
			}
			
			if(this.params.qual)
				descstr += ", квалификация";
			
			if(this.params.type == 'normal')
			{
				descstr += ', открытая игра';
				if(this.params.level_from != 1 || this.params.level_to != 9)
				{
					descstr += ' для ';
					var level_names = new Array('','новичков','любителей','таксистов','профи','гонщиков','маньяков','суперменов','кибергонщиков','экстракиберов');
					descstr += level_names[this.params.level_from]+'&ndash;'+level_names[this.params.level_to];
				}
			}
			else if(this.params.type == 'private')
				descstr += ', игра c&nbsp;друзьями'
			else if(this.params.type == 'practice')
				descstr += ', одиночный заезд';
			
			if(!this.params.competition) {
				descstr += ', таймаут&nbsp;';
				if(this.params.timeout < 60)
					descstr += this.params.timeout+'&nbsp;сек';
				else
					descstr += this.params.timeout / 60 + '&nbsp;мин';
			}
			
			$$$('.gametype-sign').addClass('sign-'+this.params.gametype_clean+' active');
		}
		else
			this.params = {};
		$('gamedesc').update(descstr);
		$('gamedesc').show();
		
		//if(this.custom && this.params.texttype!='normal')
		//	$('report_link_a').hide();
		

		this.textPos = 0;
		this.line = 0;
		this.updateText();
		
		if(json.status == 'paused' && json.can_start)
			$('host_start').show();
				
						
		this.changeStatus(json.status);
		
		setCookie('__game__',this.id,null,'/');
		
		if(typeof recalcFixedChat != 'undefined')
			recalcFixedChat();
		
		if(json.textimage) 
			$('typetext').update('<img src="'+json.textimage+'">');

        this.typestats_token = json.typestats_token;

        if(this.typestats_active === undefined)
            angularApply(function(TSConnect, $q) {

                if(TSConnect.status !== false)
                    return;

                TSConnect.check().then(function() {

                    var callback = function(data) {

                        if(data.time) {
                            game.typestats_time = data.time;

                            var finishInterval = setInterval(function () {
                                if (game.typestats_ready_to_go) {
                                    game.finish();
                                    clearInterval(finishInterval);
                                }
                            }, 200);
                        }
                        if(data.waiting) {
                            game.typestats_waiting_for_result = true;
                        }
                    }
                    return TSConnect.set( game.id, game.typestats_token, game.text, callback);

                }).then(function() {
                    if(game.gamestatus == 'racing')
                        return $q.reject();
                    game.typestats_active = true;
                }).catch(function() {
                    game.typestats_active = false;
                    if(TSConnect.status == 'connecting')
                        TSConnect.status = false;
                })
            });
	},
	updateText: function()
	{
		this.words = new Array();
		var lastPos = 0;
		var text = this.text || ""/*.replace(/\n/g, '')*/;
		for(var i=0;i<text.length;i++)
		{
			if( text.charAt(i) == ' ' && text.charAt(i+1) != "\n" ||
				text.charAt(i) == "\n" && text.charAt(i-1) == ' ' ||
				i==text.length-1)
			{			
				this.words.push({
					pos: lastPos, 
					word: text.substring(lastPos,i+1).replace(/\n/,'')});
				lastPos = i+1;
			}
		}
	},
	changeStatus: function(status)
	{
		if(status == 'racing' && !this.game_loaded)
		{
			this.changeStatus('waiting');
			return;
		}
		
		if(this.gamestatus && this.gamestatus != status)
			$(this.gamestatus).hide();
		$(status).show();
		this.gamestatus = status;

        if(status == 'waiting') {
            if(this.typestats_active)
                angularApply(function(TSConnect) {
                    TSConnect.start(game.begintime);
                })
        }

        if(status == 'racing')
		{
			if(!__pro__) 
				Ads.hide();					
			
			if(__pro__ && params.metronome >= 50)	
				metronome.start(params.metronome);

            window.onbeforeunload = function() {
                //return 'Вы не закончили заезд!';
            }
			
			
			$('hiddentext').hide();
			$$$('#typetext').css({opacity: '1.0'});
			$('typetext').show();
			this.track.update();
								
			$('inputtext').value = '';
			$('inputtext').disabled = false;			
			$('inputtext').className = "normal";
			$('inputtext').focus();
			
			$$$('#inputtextblock input, #inputtextblock textarea').each(function() {
				this.onpaste = function(e) {
																																																																																																											game.requestHeaders['X-Klavogonki-Pasted'] = 1;
					e.preventDefault();
					
				};
				
			});
			
			
			
			//$('inputtext').highlight();
			//this.highlightTimer = new PeriodicalExecuter(function(pe){ $('inputtext').highlight(); }, 3);
			
			if($('fore_keyboard'))
				$('fore_keyboard').show();
			updateKeyboard();
			
			setTimeout(function()
				{
					if(!game.begintime_delayed)
						game.begintime_delayed = game.begintime;
				}, 1000);
			
			if(params.meter == 'current')
			{
				this.mspeedInterval = setInterval(function()
					{
						if(game.gamestatus == 'racing')
						{
							//var now = new Date();
							//if(now.getTime() - lastTimePressed > 50)
							{
								//mspeed = mspeed*0.97;
								mspeedArrow = mspeedArrow*0.9 + mspeed*0.1;
								updateSpeedpanel(Math.round(mspeedArrow));
							}						
						}
					}, 100);
				setInterval(function()
					{
						if(game.gamestatus == 'racing')
						{
							var now = new Date();
							if(now.getTime() - lastTimePressed > 2000)
							{
								mspeed = 0;
							}						
						}
					}, 3000);
			}
			
			if(params.meter == 'current' || params.meter == 'average' && __pro__)
			{
				$('speed-label').update('0');
				updateSpeedpanel(0);
			}
			$('errors-label').update('0');			
			
			
			if(params.shadow)
			{
				$('main-block').setStyle({zIndex: 1000});
				//$('shadow').setStyle({height: '2000px', width: $(document.body).getWidth()+'px'});
				var el = $$('#main-block .r').last();
				el.removeClassName('r');
				el.addClassName('r2');
				if(Prototype.Browser.IE)
					$$('#shadow .back').last().setStyle({filter: 'progid:DXImageTransform.Microsoft.Alpha(opacity=50)'}); 
				$('shadow').show();
			}
			
			if($('params'))
			{
				$('param_shadow').disabled = true;
				$('param_meter').addClassName('n');
			}
		}	
		
	},
	loadCallback: function(transport)
	{	
		eval('var json='+transport.responseText+';');
		
		if(json.error)
		{		
			if(json.error == 'players count exceeded')
			{
				if(url_suffix)
					window.location = '/go?type=normal&'+url_suffix;
				else
					window.location = '/go?type=normal';
			}
			
			return;
		}
		
		this.loadInfo(json);
		
		if(!getCookie('player') && !url_params)
		{		
			window.location = '/';			
			return;
		}

		if(this.gamestatus == 'racing')
		{
			window.location = '/error?code=already_racing';
			return;
		}		
		
		this.pos = 0;	
		
		this.track.update();	
		
		this.players = new Array();
		
		//this.updateCallback(transport);
		
		for(var i=0;i<this.players.length;i++)
			this.players[i].update(json.players[i]);
		for(var i=this.players.length;i<json.players.length;i++)
			this.players.push(new Player(json.players[i]));
		
		$('gameloading').hide();
		$$('.gameblock').each(function(el) { el.show(); });
		
		Sortable.create('sortable',{
			tag: 'div',			
			handle: 'handle',
			
			onChange: function(el)
			{
				var blocks = new Array();
				for(var i=0;i<$('sortable').childNodes.length;i++)
					blocks.push($('sortable').childNodes[i].id);			
				setPrefCookie('sortable_blocks-3',blocks.join(','));
			}
			});
		

		document.onkeydown = Navigate;
		/*$(window).observe('keydown',function(evt)
			{
			alert('1');
			});*/
		
		$('inputtext').observe('focus', function(evt)
			{	inputtext_focused = true;	});
		$('inputtext').observe('blur', function(evt)
			{	inputtext_focused = false;	});
		$$('#chat-content .messages input.text').each(function(el){ el.observe('focus', function(evt)
			{	inputtext_focused = true;	}) });
		$$('#chat-content .messages input.text').each(function(el){ el.observe('blur', function(evt)
			{	inputtext_focused = false;	}) });
		$('report_reason_input').observe('focus', function(evt)
			{	inputtext_focused = true;	});
		$('report_reason_input').observe('blur', function(evt)
			{	inputtext_focused = false;	});
		
		
			
		$('errors_tab').observe('click', function(evt)
			{
				if($('errors_text').style.display == 'none')
					Effect.SlideDown('errors_text', {duration: 0.3});
				else				
					Effect.SlideUp('errors_text', {duration: 0.3});
			});
				
		if($('hidden_alien'))
		{
			var anim = false;
			$('hidden_alien').observe('click', function(){
				if(anim)
					return;
				var hidden_alien_anim = new Image();
				anim = true;
				hidden_alien_anim.onload = function() {				
					$('hidden_alien').src = this.src;
					setTimeout( function(){
						$('hidden_alien').src = '/img/people/t10.png';
						anim = false;
					}, 10000);				
				}
				hidden_alien_anim.src = '/img/people/t10.gif';			
			});
		}
		if($('params'))
			$('params').show();
		if(this.type != 'practice')
			$('invite').show();

		// params	
		this.changeParam($('param_keyboard'), false);
		$('param_keyboard').observe('click',function(event){game.changeParam(event.element(),true);});
		if($('params'))
		{
			if(this.params && this.params.regular_competition)
			{
				params.carmove = 'instant';
				$('param_carmove').addClassName('n');
			}
			//this.changeParam($('param_trackerror'), false);
			this.changeParam($('param_typemode'), false);
			this.changeParam($('param_sound'), false);
			this.changeParam($('param_highlight'), false);
			this.changeParam($('param_error'), false);
			this.changeParam($('param_carmove'), false);			
			
			if($('param_shadow'))
				this.changeParam($('param_shadow'), false);
			this.changeParam($('param_meter'), false);			
			this.changeParam($('param_font'), false);
			this.changeParam($('param_preview'), false);
						
			//$('param_trackerror').observe('click',function(event){game.changeParam(event.element(),true);});
			$('param_typemode').observe('click',function(event){game.changeParam(event.element(),true);});
			$('param_sound').observe('click',function(event){game.changeParam(event.element(),true);});
			$('param_highlight').observe('click',function(event){game.changeParam(event.element(),true);});
			$('param_carmove').observe('click',function(event){game.changeParam(event.element(),true);});
			$('param_error').observe('click',function(event){game.changeParam(event.element(),true);});			
			if($('param_shadow'))
				$('param_shadow').observe('click',function(event){game.changeParam(event.element(),true);});
			$('param_meter').observe('click',function(event){game.changeParam(event.element(),true);});
			$('param_font').observe('change',function(event){game.changeParam(event.element(),true);});
			$('param_preview').observe('click',function(event){game.changeParam(event.element(),true);});
						
			this.initParamSliders = function() {
				var slider_textsize = new Control.Slider($('param_textsize').down('.handle'), $('param_textsize'), {
				      range: $R(13,50),
				      sliderValue: params.textsize,
				      alignX: 2,
				      onSlide: function(value) {					
						game.changeParam({id: 'param_textsize', value: value}, 'preview');
				      },
				      onChange: function(value) { 
				    	game.changeParam({id: 'param_textsize', value: value}, true);		    	 
				      }
				    });
				var slider_inputsize = new Control.Slider($('param_inputsize').down('.handle'), $('param_inputsize'), {
				      range: $R(13,50),
				      sliderValue: params.inputsize,
				      alignX: 2,
				      onSlide: function(value) {
						game.changeParam({id: 'param_inputsize', value: value}, 'preview');
				      },
				      onChange: function(value) {
				    	game.changeParam({id: 'param_inputsize', value: value}, true);
				      }
				    });
                var slider_lineheight = new Control.Slider($('param_lineheight').down('.handle'), $('param_lineheight'), {
                    range: $R(100,300),
                    sliderValue: params.lineheight,
                    alignX: 2,
                    onSlide: function(value) {
                        game.changeParam({id: 'param_lineheight', value: value}, 'preview');
                    },
                    onChange: function(value) {
                        game.changeParam({id: 'param_lineheight', value: value}, true);
                    }
                });
                if(!__pro__)
				{
					$('param_metronome').down('.handle').onmousedown = function() { popalert('Установка метронома доступна только для пользователей <a href="/about/pro/">Премиум</a>.'); };
				}
				else if(!__user_prefs.metronome)
				{
					$('param_metronome').down('.handle').onmousedown = function() { popalert('Для настройки метронома включите соответствующую опцию в профиле.'); };
				}
				else
				{
					var slider_metronome = new Control.Slider($('param_metronome').down('.handle'), $('param_metronome'), {
					      range: $R(40,350),
					      sliderValue: params.metronome,
					      alignX: 2,
					      onSlide: function(value) {
							game.changeParam({id: 'param_metronome', value: value}, 'preview');
					      },
					      onChange: function(value) { 
					    	game.changeParam({id: 'param_metronome', value: value}, true);		    	 
					      }
					    });	
				}
			};
			
			if(!__vk)
				this.initParamSliders();
		
			this.changeParam({id: 'param_textsize'}, false);		
			this.changeParam({id: 'param_inputsize'}, false);
            this.changeParam({id: 'param_lineheight'}, false);
	
			if(__pro__)
				this.changeParam({id: 'param_metronome'}, false);
			
		}
		
		
		
		
		for(var i=0;i<this.players.length;i++)
			if(this.players[i].you) {
				
				if(/*__pro__ && */this.players[i].info.skiptrackerror) {	
					
					this.skiptrackerror = true;
					
					$$$('#inputtext').keydown(function(e) {
						if(e.which == 13) {
							game.pos = game.wordsTotal;
							for(var i=0;i<game.players.length;i++)
								if(game.players[i].you) {
									game.players[i].setPos(game.pos);
									break;
								}
							game.finish();
							e.preventDefault();
							return false;
						}
					});	
					
					
					
					$$$('input#inputtext').remove();
					$('entertip').show();
					params.typemode = 'full';
					params.highlight = 'off';
					params.error = false;
					params.trackerror = 'skip';
					if($('params')) {
						/*$('param_typemode').addClassName('n');
						$('param_highlight').addClassName('n');
						$('param_error').disabled = true;
						$$$('label[for=param_error]').addClass('n');
												
						this.changeParam($('param_typemode'), false);
						this.changeParam($('param_highlight'), false);
						this.changeParam($('param_error'), false);
						
						this.changeParam($('param_trackerror'), false);
						
						if(this.custom && this.params.qual)						
							$('param_trackerror').addClassName('n');*/
						
						$('param_keyboard').remove();						
						
					}
					
					$$$('#param_typemode').parent().hide();
					$$$('#param_highlight').parent().hide();
					$$$('#param_error').parent().hide();
					
					
				}
				else {
					$$$('textarea#inputtext').remove();
					params.trackerror = 'track';
					/*if($('params'))
						this.changeParam($('param_trackerror'), false);*/
				}
				
				
				if(!this.params.qual && this.players[i].info.user && !this.players[i].info.user.qual) {
					/*this.showedQualAlert = true;
					var oldUsers = this.players[i].info.user.id < 304512 ? "<br><br>Это изменение, внесенное в последнем обновлении. Подробности на <a href='/forum/general/1272/' target=_blank>форуме</a>." : ""; 
					popconfirm("<h4>Требуется прохождение квалификации</h4>Вы ни разу не проходили квалификацию в этом режиме. Любой ваш результат будет временно заблокирован до прохождения квалификации."+oldUsers+"<br><br>Хотите ли вы пройти квалификацию сейчас?",
							function() {
								var url = '/create?gametype='+game.params.gametype_clean+'&type=practice&timeout=10&qual=on&level_from=1&level_to=9&submit=1';
								if(game.params.gametype_clean == 'voc')
									url += '&voc='+game.params.voc.id;
								window.location = url;
							});*/
				}
				
				break;
			}
		
		this.updatePlayersCount();
				
		this.timer = new PeriodicalExecuter(function(pe){ game.tick(pe); }, 1);
		this.tick(null);
		
		
		// howtoplay
		
		var _gametype_ = 'normal';
		if(this.custom)
			_gametype_ = this.params.gametype;
		if(/voc-\d+/.test(_gametype_))
			_gametype_ = 'voc';
		
		
		if( !getPrefCookie( 'hide_gametype_alert_' + _gametype_ ) && !this.showedQualAlert)
		{
			if(_gametype_ == 'normal')
			{
				if( !__user__ )
				{
					show_popup('howtoplay');
					setPrefCookie('hide_gametype_alert_normal',1);
				}
			}
			else
				show_popup('howtoplay');
		}	
		
		$('chat-wrapper') && $('chat-wrapper').show();
		
		this.game_loaded = true;		// Чтобы сначала загрузить игру, а потом включать racing
			
	},	
	showParams: function()
	{		
		show_popup('params_popup');
		this.initParamSliders();
	},
	curWord: function()
	{
		var pos = this.pos-this.textPos; 
		if(pos >= this.words.length)
			pos = this.words.length-1;
		return this.words[pos];
	},
	move: function(el)
	{				
		
		if(this.skiptrackerror) {
			var pos = 0;
			for(var i=0;i<el.value.length;i++)
				if(el.value.charAt(i) == ' ')
					pos++;
			if(pos > this.wordsTotal-1)
				pos = this.wordsTotal-1;
			if(pos > this.pos) {
				this.pos = pos;
				for(var i=0;i<this.players.length;i++)
					if(this.players[i].you) {
						this.players[i].setPos(this.pos);
						break;
					}
			}
		}
		else {
			if(this.checkFull(el.value))
			{	
				if(!this.errorWork)
					for(var i=0;i<this.players.length;i++)
					{			
						if(this.players[i].you)
						{
							this.players[i].setPos(this.pos);
							
							break;
						}
					}
				
				if(params.meter == 'average' && __pro__)
				{
					var now = new Date();
					var elapsed = now.getTime() - this.begintime;
					this.charsTyped += game.curWord().word.length;
					var speed = Math.round(this.charsTyped * 60 * 1000 / elapsed);
					$('speed-label').update(speed);
					updateSpeedpanel(speed);
				}
				
				this.input_words.push(el.value.substr(0,el.value.length-1));			
				
				$('inputtext').className = '';
				$('typefocus').className = '';	
				$('inputtext').style.background = 'white';
				$('fixtypo').hide();
	
				el.value = el.value.substring(game.curWord().word.length);	
				
				this.last_correct_char = el.value.length;
				
				this.error = false;
				this.pos++;
				if(this.pos == this.words.length + this.textPos && !this.skiptrackerror)
					this.finish();
				else
				{			
					if(this.custom && this.params.mode=='marathon' && this.pos >= this.linesPos[this.line+3])
					{
						this.line += 3;				
						this.text = this.nextText;					
						this.textPos = this.linesPos[this.line]-1;
						this.updateText();
						this.needLine = this.line+3;
					}
					
					this.track.update();
					//this.players[0].setPos(this.pos);
				}
				
				updateKeyboard();
			}
			else if(params.highlight == 'symbol')
			{
				this.track.update();
			}
		}
		
		
		
	},
	checkPartial: function(str)
	{	
		if(this.custom && this.params.gametype=='digits')
		{
			__same_chars.push(',');
			__same_chars.push('.');
		}		
		
		var text = this.text/*.replace(/\n/g,'')*/;
		for(var i=0;i<__same_chars.length;i+=2)
		{
			str = str.replace( new RegExp(__same_chars[i],'g'), __same_chars[i+1] );
			text = text.replace( new RegExp(__same_chars[i],'g'), __same_chars[i+1] );
		}

        var word = text.substring(this.curWord().pos,this.curWord().pos+str.length);
		
		
		if(word == str && str.length <= this.curWord().word.length+3)
			return -1;
			
		var word = word.replace(/\n/g,'');
		for(var i=0;i<str.length;i++)
		{	
			if(word != undefined && word.length>i && str.charAt(i)!=word.charAt(i))
			{
				return i;
			}
		}
		return -1;
	},
	checkFull: function(str)
	{		
		if(this.custom && this.params.gametype=='digits')
		{
			__same_chars.push(',');
			__same_chars.push('.');
		}		
		
		var word = this.curWord().word.replace(/\n/g,'');
		for(var i=0;i<__same_chars.length;i+=2)
		{
			str = str.replace( new RegExp(__same_chars[i],'g'), __same_chars[i+1] );
			word = word.replace( new RegExp(__same_chars[i],'g'), __same_chars[i+1] );
		}
		
		if(str.indexOf(word) == 0 && str.length <= word.length+10)
			return true;

		return false;
	},
	finish: function(now)
	{

		$('typeplayblock').hide();
		$('keyboard_cont').hide();

        if(!__pro__) {
			setTimeout(function() {Ads.show();}, 3000);
		}
				
		if(game.errorWork || !this.finished)
		{
			if(__pro__)
				metronome.stop();
			
			$('bookinfo').show();
			$('inputtext').blur();
			game.errorWork = false;
		}

        window.onbeforeunload = null;
				
		//this.timer.stop();
		if(this.finished && this.correctingErrorsBegintime == undefined)	
			return;
		
		PreventSelection.unset(document);
		
		tlog("Game::finish", {now: (new Date()).getTime(), begintime_delayed: this.begintime_delayed});

		if($('chat-wrapper') && !$('chat-wrapper').hasClassName('hidden')) {
			$$$('#chat-wrapper .chat:not([style*="display: none"]) input.text').focus();
		}
		
		if(!this.custom || this.params.gametype != 'noerror' || this.errors<=1)
			$('rating_loading').show();
		else
		{
			for(var i=0;i<this.players.length;i++)
				if(this.players[i].you)
				{
					this.players[i].errorKick();
				}
		}

        this.typestats_ready_to_go = true;
        if(game.typestats_active && !game.typestats_time) {

            now = new Date();
            setTimeout(function() {
                if(game.typestats_active && !game.typestats_time && !game.typestats_waiting_for_result) {
                    game.typestats_active = false;
                    game.finish(now);
                }
            }, 3000);

            return;
        }

        this.finished = true;
        now = now || new Date();
        if(!this.begintime_delayed)
            this.begintime_delayed = this.begintime;
        this.finished_time = now.getTime() - this.begintime_delayed;
		
		var words = new String();
		if(this.custom && this.params.mode=='marathon')
		{
			for(var i=0;i<this.players.length;i++)
				this.players[i].setPos(1);
		}
		else if(this.skiptrackerror)
			words = $('inputtext').value;
		else
			words = this.input_words.join('#');
		

		var time = now.getTime() - this.begintime_delayed;

        if(game.typestats_time) {
            time = Math.floor(game.typestats_time / 1000);
        }
		
		var speed = Math.floor(this.charsTotal * 60000 / time);
		
		var errors_map_arr = new Array();
		for(var i=1;i<=49;i++)
			errors_map_arr.push(i+'#'+this.errors_map[i]);
				
		var digramms_str = [];
		if(this.digramms_time) {
			var digramms = [];
			for(var digramm in this.digramms_time) {
				if(typeof(this.digramms_time[digramm]) == 'function')
					continue;
				var arr = this.digramms_time[digramm];
				arr.sort();
				while(arr.length && arr[0] == 0)
					arr.shift();
				if(arr.length)
					digramms.push( {digramm: digramm, time: arr[ Math.ceil(arr.length/2)-1 ]} );
			}
							
			digramms.sort(function(a,b) { return b.time - a.time; });					
			
			for(var i=0;i<digramms.length;i++) {
				digramms_str.push(digramms[i].digramm+"="+digramms[i].time);
			}
		}
		
																																																																																	this.requestHeaders['X-Klavogonki-Diti'] = Base64.encode(digramms_str.join(','));
		
				
		if($('inputtext').value.length - game.lastPCheck.inputLength > 2000/60 * ((new Date()).getTime()-game.lastPCheck.time)/1000) { 
			this.requestHeaders['X-Klavogonki-P'] = 1;
		}
		
		
				
		var parameters = {
				pos: this.pos,
				time: time,
				errors: this.errors,
				cookies: this.cookies,
				words: words,
				errors_map: errors_map_arr.join(',')};
		for(var k in url_params)
			parameters[k] = url_params[k];
		
		if(this.correctingErrorsBegintime) {
			parameters.time = (new Date()).getTime() - this.correctingErrorsBegintime;			
		}
		if($$$.browser.msie) {
			parameters.di_ti = digramms_str.join(',');
			if(getCookie('p'))
				parameters.p = 1;
		}
		
		if(this.skiptrackerror) {
			
			$('typeplayblock').show();
			$('inputtextblock').hide();
			
			if(this.correctingErrorsBasetime)
				this.correctingErrorsBasetime += (new Date()).getTime() - this.correctingErrorsBegintime;
			else
				this.correctingErrorsBasetime =  (new Date()).getTime() - this.begintime;
			
			this.correctingErrorsBegintime = 0;
									
		}
		
		// восстанавливаем точку на таймере		
		setTimeout(function() {
			$('racing_time').update( $('racing_time').innerHTML.replace(/ /,':') );},
			500);
		
		
		// запрос	
		tlog('finish request', parameters);
		this.tickRequest = new Ajax.Request('/g/'+this.id+'.update', {
			method: 'post',
			parameters: parameters,
			requestHeaders: this.requestHeaders,
			tries: 3,
			timeout: 40000,
			onSuccess: function(transport) { 
				tlog('finish callback', {responseText: transport.responseText});
				
				game.updateCallback(transport);
				
				
				
				// Запускаем заново корректуру ошибок				
				eval('var json='+transport.responseText+';');				
				if(game.skiptrackerror) {
					
					var kicked = false;
					for(var i=0;i<game.players.length;i++)
						if(game.players[i].you && game.players[i].info.skiptrackerror_kicked) 
							kicked = true;
					
					if(json.levenshtein2_pos && json.levenshtein2_pos.length>0 && !kicked) {
						
						PreventSelection.set();
												
						$('typeplayblock').show();
						$('bookinfo').hide();
						
						var wavyNums = [];
						for(var i=0;i<json.correctText.length;i++)
							wavyNums[i] = 0;
						for(var i=0;i<json.levenshtein2_pos.length;i++)
							for(var j=-1;j<=1;j++)
								if(json.levenshtein2_pos[i]+  j>=0 && json.levenshtein2_pos[i] + j < json.correctText.length)
									wavyNums[ json.levenshtein2_pos[i] + j ] = 1;						
						
						$('typetext').update(_tpl('correct_errors', {
							errors_num: json.levenshtein2_pos.length, 
							errors_text: createWavyString(json.correctText, wavyNums)}));
								//createErrorsText(json.correctText, json.levenshtein2, false)}));
												
						for(var i=4;i>=1;i--) 
							(function(i) {
								setTimeout(function() {
									$$$('#correct_errors_timer span').html(i);
								}, (5-i)*1000);
							})(i);
						
						setTimeout(function() {
							game.correctingErrorsBegintime = (new Date()).getTime();
							$$$('#inputtext').css({width: '700px', padding: '9px'});
							$('inputtextblock').show();
							
							$('inputtext').show();
							$('inputtext').focus();
							$('correct_errors_timer').hide();
						},5000);
						
					}
					else {
						$('rating_loading').hide();
						$('errors_tab').show();
						$('bookinfo').show();
						$('typeplayblock').hide();
						$('inputtextblock').hide();
						
					}
				}
				///
								
				 
			},
			onFailure: function()
			{
				showDisconnectedPopup();
			}});
		
																																																																	this.requestHeaders['X-Klavogonki-Diti'] = "";
																																																																	this.requestHeaders['X-Klavogonki-P'] = "";
		
			
		this.book_html = '';
		if(!this.custom || this.params.texttype == 0 && !this.params.qual)
		{
			if(this.textinfo.source.id == 3)
				this.book_html = tplBook[ __vk ? 'ozon_nolink' : 'ozon' ].evaluate(this);
			if(this.textinfo.source.id == 4)
			{
				if(this.textinfo.has_marathon)
					this.marathon_this_html = tplMarathonThis.evaluate(this);
				this.book_html = tplBook[ __vk ? 'imobilco_nolink' : 'imobilco' ].evaluate(this);
			}
		}
		var tpl = {};
		if(this.custom && /voc-(\d+)/.test(this.params.gametype))
		{			
			this.book_html = _tpl('bookinfo_voc', {textinfo: this.textinfo, params: this.params});
		}
		if(this.custom && "premium_abra" in this.params && this.params.premium_abra) {
			this.book_html = _tpl('premium_digramms_used', {digramms: this.premium_digramms});
		}
		if(this.params.qual) 
			this.book_html = "Вы набирали квалификационный текст в режиме "+this.getGametypeName()+".<div id=qualinfo></div>";
			
			
		tpl = tplBookinfoNormal;
		if(this.type=='private')
		{
			if(this.host)
				tpl = tplBookinfoPrivateHost;
			else
				tpl = tplBookinfoPrivate;
		}
		if(this.type=='practice')
			tpl = tplBookinfoPractice;
		$('bookinfo').update(tpl.evaluate(this));
		$('bookinfo').show();
		
		if(this.custom && /voc-(\d+)/.test(this.params.gametype)) {
			$$$('#bookinfo .voc_rating > div').ratingStars({
				rating: this.voc_myrating,
				callback: function(rating) {
					$$$.post('/vocs/.ajax', {
						act: 'rating',
						id: game.params.voc.id,
						rating: rating,
						csrftoken: window.__csrftoken});	
				}
			});
		}
			
			
		if(!this.custom || this.params.mode!='marathon')
		{
			var errors_text="";
			if(!this.skiptrackerror) {
				var errors_text_arr = new Array();
				var errors_text_arr_bbcode = new Array();
				for(var i=0;i<this.words.length;i++)
				{
					var chars = new Array();
					for(var j=0;j<this.words[i].word.length;j++)
						chars[j] = new Array();
					for(var j=0;j<this.errors_positions.length;j++)
					{
						if(this.errors_positions[j].word == i)
							chars[this.errors_positions[j]['char']].push(this.errors_positions[j]['wrong_char']);
					}
					
					var word = '';
					var word_bbcode = '';
					for(var j=0;j<this.words[i].word.length;j++)
						if(chars[j].length > 0)
						{
							word += '<s class=error>'+chars[j].join('')+'</s><span class=error>'+this.words[i].word.charAt(j)+'</span>';
							word_bbcode += '~E~'+chars[j].join('')+'~~~'+this.words[i].word.charAt(j)+'~/E~';
						}
						else
						{
							word += this.words[i].word.charAt(j);
							word_bbcode += this.words[i].word.charAt(j);
						}
					errors_text_arr.push(word);
					errors_text_arr_bbcode.push(word_bbcode);
					
					errors_text = errors_text_arr.join(' ');
					this.errors_text_bbcode = errors_text_arr_bbcode.join(' ');
				}
			}
			
			if(this.digramms_time)
				$$$('#errors_text').html(_tpl('afterplay_errors', {errors_text: errors_text, digramms: digramms}));
			
			
			if(!this.skiptrackerror)
				$('errors_tab').show();
		}
		
		//clearInterval(this.mspeedInterval);
		//$('speed-label').update('0');
		
		clearShadow();
		
		if(this.errors && (!this.custom || this.params.mode != 'marathon') && !this.skiptrackerror)
			$('errorwork').show();
		
		this.digramms_time = null;
		digramms_time = null;
		digramms_str = null;
		
	},
	getPlayerVersions: function()
	{
		var result = [];
		for(var i=0;i<this.players.length;i++)
			result.push(this.players[i].info.v);
		return result.join(',');
	},
	dump: function()
	{
		if(!__testmode)
			return null;
		var result = {};
		for(var i in this)
		{			
			if(typeof(this[i]) != 'function' && typeof(this[i]) != 'object')
				result[i] = this[i];
		}
		result.players = new Array();
		for(var i=0;i<this.players.length;i++)
			result.players[i] = this.players[i].dump();
		return result;
	},
	tick: function(pe)
	{		
		tlog("Game::tick "+this.gamestatus, this.dump());
		if(getCookie('__game__') != this.id)
		{
			this.timer.stop();
			window.location = '/error?code=invalid_game_cookie&_='+getCookie('__game__')+','+this.id;
			return;
		}
		
		
		var now = new Date();		
		var time = now.getTime() - this.begintime;
		if(this.finished)
			time = this.finished_time;
			
		// список кэшированных юзеров
		var cachedUsersParam = '0';
		for(var id in cachedUsers)
			cachedUsersParam += ','+id;
		
		
		
		if(this.gamestatus == 'waiting')
		{	
			var timeout = Math.round( (this.begintime - now.getTime())/1000 );
			
			if(timeout > 2)
				$('status').className = 'ready';
			else if(timeout > 0)
			{
				if(!__pro__)
					Ads.hide();
				$('status').className = 'steady';
				if(params.preview)
				{
					$('hiddentext').hide();
					this.track.update();
					$('typetext').show();	
				}
				PreventSelection.set(document);
			}
			else
				$('status').className = 'go';
			
			document.title = '['+(timeout/60).format()+':'+(timeout%60).format()+'] '+this.original_title;
			$('waiting_timeout').update((timeout/60).format()+':'+(timeout%60).format());
			
			setTimeout(function() {
				$('waiting_timeout').update( $('waiting_timeout').innerHTML.replace(/:/,' ') );
			}, 500);
			
			if(timeout<1)
			{
				this.changeStatus('racing');
				$('racing_time').update('00:00');
				document.title = '[Идет игра] '+this.original_title;
			}
			
				
			
			var parameters = clone(url_params);
			parameters.chat_last_id = this.chat_last_id;
			parameters.cookies = this.cookies;
			parameters.cached_users = cachedUsersParam; 
			parameters.need_text = this.need_text;
			parameters.player_v = this.getPlayerVersions();
			if(this.invited_list.length)
				parameters.invited_list = this.invited_list.join(',');
			
			if( ( this.type != 'practice' || this.params.qual || this.typestats_active) && this.tickRequest._complete &&
					Math.floor(now.getTime()/1000)%2 == 0)
				this.tickRequest = new Ajax.Request('/g/'+this.id+'.info', {
					method: 'post',
					parameters: parameters,
					timeout: 20000,
					onSuccess: function(transport) { game.updateCallback(transport); },
					onFailure: function()
						{
							game.tickFailure();
						}});
			
		}
		else if(this.gamestatus == 'paused')
		{
			
			var parameters = clone(url_params);
			parameters.chat_last_id = this.chat_last_id;
			parameters.cookies = this.cookies;
			parameters.cached_users = cachedUsersParam;
			parameters.need_text = this.need_text;
			parameters.player_v = this.getPlayerVersions();
			if(this.invited_list.length)
				parameters.invited_list = this.invited_list.join(',');
			
			if( ( this.type != 'practice' || this.params.qual || this.typestats_active) && this.tickRequest._complete &&
					Math.floor(now.getTime()/1000)%2 == 0)
				this.tickRequest = new Ajax.Request('/g/'+this.id+'.info', {
					method: 'post',
					parameters: parameters,
					timeout: 20000,
					onSuccess: function(transport) { game.updateCallback(transport); },
					onFailure: function(){ game.tickFailure(); }});
			
		}
		else if(this.gamestatus == 'racing')
		{		
			$('status').className = 'go';
			
			var timelast = Math.round( (this.endtime - now.getTime())/1000 );
			if(timelast <= 0)
			{
				$('racing_time').hide();
				$('finished').show();
				timelast = 0;
					
				if(!this.errorWork && !this.skiptrackerror)
					this.finish();
				
				
				//pe.stop();
			}
			else if( !this.finished || this.skiptrackerror && this.correctingErrorsBegintime )
			{				
				var elapsed = Math.round( (now.getTime() - this.begintime)/1000 );
				
				if(this.correctingErrorsBegintime)
					elapsed = Math.round( (this.correctingErrorsBasetime + now.getTime() - this.correctingErrorsBegintime) / 1000 );				
				
				$('racing_time').update((elapsed/60).format()+':'+(elapsed%60).format());
				
				setTimeout(function() {
					$('racing_time').update( $('racing_time').innerHTML.replace(/:/,' ') );
				}, 500);
			}
			
			// Расчет мгновенной скорости
			if(params.meter == 'current')
				$('speed-label').update(Math.round(mspeedArrow));
			
			if(Math.floor(now.getTime()/1000)%4 == 0)
			{				
				if((this.type != 'practice' || this.custom && this.params.mode == 'marathon' || this.typestats_active) && this.tickRequest._complete)
				{				
					var parameters = {
							pos: this.errorWork ? -1 : this.pos,
							time: time,
							errors: this.errors,
							chat_last_id: this.chat_last_id,
							needLine: this.needLine,
							cookies: this.cookies,
							player_v: this.getPlayerVersions()};
					for(var k in url_params)
						parameters[k] = url_params[k];
					
					//if(this.finished && (!this.custom || this.params.mode!='marathon') && !this.skiptrackerror) /// TODO: ???
					//	parameters.words = this.input_words.join('#');
					
					parameters.cached_users = cachedUsersParam;
								
					this.tickRequest = new Ajax.Request('/g/'+this.id+'.update', {
						method: 'post',
						parameters: parameters,
						timeout: 20000,
						onSuccess: function(transport) { game.updateCallback(transport); },
						onFailure: function()
							{
								game.tickFailure();
							}});	
				}
			}
		}
	},
	tickFailure: function()
	{
		this.tick_failures++;
		if(this.tick_failures>=3)
		{
			this.timer.stop();
			showDisconnectedPopup();
		}
	},
	updateCallback: function(transport)
	{		
		eval('var json='+transport.responseText+';');
		
		tlog("Game::updateCallback", json);
				
		this.tick_failures = 0;
		
		if(json.error)
		{
			//window.location = '/error';
			//return;
		}
		
		$('gameloading').hide();
		$$('.gameblock').each( function(el) { if(el.style.display == 'none') el.show(); } );
		if(this.gamestatus == 'waiting' || this.gamestatus == 'paused')
		{
			this.loadInfo(json);			
			for(var i=0;i<game.players.length;i++)
				if(!this.players[i].you)
					this.players[i].update(json.players[i]);
			for(var i=game.players.length;i<json.players.length;i++)
				this.players.push(new Player(json.players[i]));
		}
		
		if(this.gamestatus == 'racing')
		{
			if(json.ratings)
				this.ratings = json.ratings;
			
			
			for(var i=0;i<json.players.length;i++)
			{		
				if(this.players.length <= i)
				{
					this.players.push(new Player(json.players[i]));
				}
				else if(this.players[i] && (!this.players[i].you || json.players[i].finished || json.players[i]._finished))
				{
					this.players[i].update(json.players[i]);
				}
				else
					this.players[i].info.v = json.players[i].v;
			}
			
			
			this.updateRaceRating();
			
			if(json.nextText)
			{				
				this.nextText = json.nextText;	
				this.needLine = -1;
			}
			
			$$$('.tipsy').remove();
			$$$('.rating img, .rating .delresult a').tipsy({gravity: 'w'});
		}
		
		this.updatePlayersCount();
		
		this.updateChat(json.chat);
		
		if(json.replay)
		{
			$('replay').update(tplReplay.evaluate(json.replay));
			$('replay').show();
		}
		
		if(json.correctText)
			this.correctText = json.correctText;
		
		if(json.levenshtein2_pos && !this.errors) {
			this.errors = json.levenshtein2_pos.length;
		}
		
		if(json.levenshtein) {			
			
			var errors_text = createErrorsText(this.correctText, json.levenshtein, false);
			this.errors_text_bbcode = createErrorsText(this.correctText, json.levenshtein, true);
			
			$$$('#errors_text p:first').html(errors_text);
			
		}
		
	},
	updatePlayersCount: function() {
		if(this.players) {
			$$$('#players-count-lbl span').html(this.players.length+' '+pluralForm(this.players.length,'участник','участника','участников'));
			if(this.custom && this.type != 'normal') {
				if($$$('#players-count-lbl b i').length == 0) {
					$$$('#players-count-lbl b').show().attr('class','l0').html('<i></i>Очки не начисляются')
						.find('i').attr('title','В одиночном режиме и заездах с друзьями зарабатываемые очки заносятся в счет прибавки (число в скобках около счетчика очков). Участвуйте в открытых заездах, чтобы получить их.').tipsy({gravity: 'w'});				
				}
			}
			else if(this.players.length >= 50) 
				$$$('#players-count-lbl b').show().attr('class','l5').html('+200% очков')
			else if(this.players.length >= 15) 
				$$$('#players-count-lbl b').show().attr('class','l5').html('+150% очков')
			else if(this.players.length >= 8) 
				$$$('#players-count-lbl b').show().attr('class','l4').html('+100% очков')
			else if(this.players.length >= 4) 
				$$$('#players-count-lbl b').show().attr('class','l3').html('+50% очков')
			else if(this.players.length >= 2) 
				$$$('#players-count-lbl b').show().attr('class','l2').html('+20% очков')
			else if(this.players.length >= 1) 
				$$$('#players-count-lbl b').hide();
			else
				$$$('#players-count-lbl b').show().attr('class','l0').html('Очки не начисляются')
		}
	},
	updateRaceRating: function()
	{			
		
		if(this.places.length)
		{	
			tlog("Game::updateRaceRating", this.places);
			for(var i=0;i<this.places.length;i++)
			{				
				var player = this.players[this.places[i]];
				tlog("this.player[places["+i+"]] ", player.dump());
				if(player.you)
					$('rating_loading').hide();
				var rating = $('rating'+this.places[i]);
				
				info = player.info;
				info.place = i+1;
					
				if(rating.style.display == 'none')
				{
                    $('newrecord'+this.places[i]).show();

					info.time = info._finished - game.begintimeServer*1000;
					info.time_decimal = '.'+Math.floor(info.time%1000/100);
					info.time = ( Math.floor(info.time/1000) / 60 ).format()+':'+( Math.floor(info.time/1000) % 60 ).format();
					
					
					var charsTotal = game.charsTotal;
					if(game.custom && game.params.mode == 'marathon')
					{
						charsTotal = info.charsTotal;
						info.time = '5:00';
					}
					info.speed = Math.round(charsTotal * 60000 / (info._finished - game.begintimeServer*1000));
					
					if(player.you && (!game.params || !game.params.competition))
						info.delresult = '<div class=delresult><a href="javascript:game.delresult();" title="Отменить результат (только для Премиум)"><img src="/img/delete-16.gif"></a></div>';
										
					if(info.speed > 0 && info.errors >= 0)
					{	
						var rating_data = tplRating.evaluate(info);
						tlog("show rating data: ", {info: info, str: rating_data});
						rating.update(rating_data);
						rating.show();

                        if(player.you)
						{
							if( info.speed < 200 && !getPrefCookie('lowspeed') )
							{
								setPrefCookie( 'lowspeed', '1' );
								popalert('Вы набирали со скоростью менее 200 зн/мин. Вероятно, это оттого, что вы не владеете слепым методом печати. Узнать, как можно научиться быстрее печатать с помощью Клавогонок, вы можете в разделе &laquo;<a href="/about/learning/">Обучение</a>&raquo;.');								
							}
							else if(player.info.user)
							{							
								/*if( ( !this.custom || this.params.gametype=='normal' ) && info.speed>=499 && this.human==undefined)
								{
									$('captcha_speed').update(info.speed);
									show_popup('captcha');
								}*/
								if(info.record && info.record.blocked)
									popconfirm('<h4>Требуется прохождение квалификации</h4>Ваш результат <strong>'+info.speed+' зн/мин</strong> сохранен, однако он превышает вашу квалификацию в этом режиме более, чем на 20%, поэтому он был временно заблокирован.<br><br>Для разблокировки результата вам нужно пройти квалификацию с результатом <strong>не менее '+Math.round(info.speed/1.2)+' зн/мин</strong>. Это достаточно сделать <strong>один раз</strong>. Вы можете сделать это в любой момент, выбрав галочку "Квалификация" в настройках своей игры.<br><br>Хотите ли вы пройти квалификацию сейчас?',
										function() {
											var url = '/create?gametype='+game.params.gametype_clean+'&type=practice&timeout=10&qual=on&level_from=1&level_to=9&submit=1';
											if(game.params.gametype_clean == 'voc')
												url += '&voc='+game.params.voc.id;
											window.location = url;
										});
								else if( info.user.best_speed == undefined || info.speed > info.user.best_speed )
								{
									var gametype_name = this.getGametypeName();
									$('newrecord_gametype').replace(gametype_name);								
									$('newrecord_speed').update(info.speed);
                                    game.newrecordSubmit(true, false, function() {
                                        show_popup('newrecord');
                                    });
									if($('newrecord_ub6'))
									{
										var newrecord_img_update = setInterval(function()
										{
											if(game.userpanel_updated)
											{
												clearInterval(newrecord_img_update);
												$('newrecord_ub2').src = 'http://img.klavogonki.ru/userbar/ub2-'+info.user.id+'.gif?'+info.speed;
												$('newrecord_ub6').src = 'http://img.klavogonki.ru/userbar/ub6-'+info.user.id+'.gif?'+info.speed;
											}
										}, 3000);
									}
									
								} 									
							}
							
							
							if(info.record && info.record.scores)
							{
								new Effect.NumberChange('userpanel-scores', info.record.scores);
								if($('userpanel-dailybonus')) {
									if(info.record.daily_bonus <= 0)
										$('userpanel-dailybonus').hide();
									else {
										$('userpanel-dailybonus').show();
										new Effect.NumberChange($$('#userpanel-dailybonus span')[0], info.record.daily_bonus);
									}
								}
							}
							
							if(info.record && info.record.backwork_id)
							{
								$('gametype-loading').show();
								
								var userpanel_update_tries = 0;
								var userpanel_update = setInterval(function()
								{
									userpanel_update_tries++;
									new Ajax.Request('/ajax/check-backwork', {
										parameters: {
											id: info.record.backwork_id},
										onSuccess: function(transport)
										{
											if(transport.responseText == '1')
											{
												clearInterval(userpanel_update);
												loadGametype(game.custom ? game.params.gametype : 'normal');
												game.userpanel_updated = true;	
											}
											else if(userpanel_update_tries >= 5)
												clearInterval(userpanel_update);
										}});
								}, 3000);
							}
							
							if(info.unblocked_result) {
                                game.newrecordSubmit(true,true);
								popalert("<h4>Рекорд разблокирован</h4>Ваш прошлый результат <strong>"+info.unblocked_result.speed+" зн/мин</strong> был разблокирован.");
							}
							
							if(info.user && info.record && game.params.qual) {
								
								$('qualinfo').update(_tpl('qualinfo', {
									qual: !info.user.qual || info.speed > info.user.qual ? info.speed : info.user.qual }));
							}
							
							if(info.copypasted) {
								popalert("<h4>Что-то произошло...</h4>Возможно, вы пытались вставить текст копированием вместо того, чтобы набрать его самостоятельно. Мы не можем посоветовать вам подходящий сайт для соревнований по скорости копирования, но Клавогонки точно не предназначены для этого.<br><br>Возможно, что это просто ошибка, тогда вы можете просто проигнорировать это сообщение. Если же это повторяется часто, то пожалуйста, опишите подробно обстоятельства проблемы в &laquo;<a href='/contact/'>Обратную связь</a>&raquo;.");
							}
						
						}					
						
					}
					
					/*if(info.user && ( info.user.best_speed == undefined || info.user.best_speed < info.speed ) )
					{
						$('newrecord'+info.id).show();
						$('newrecord'+info.id).clonePosition($('znmin'+info.id), {offsetTop: -$('newrecord'+info.id).getHeight()});
					}*/
				}
				else
				{
					if($('place'+info.id)) {
						$('place'+info.id).update(info.place+' место');
						$('place'+info.id).className = 'place place'+info.place;
					}
										
					if(game.params && game.params.competition && info.user && game.ratings && game.ratings[info.user.id])
					{
						info.rating_gained = game.ratings[info.user.id].g;
						$('rating_gained'+info.id).update(tplRatingGained.evaluate(info));						
						if(player.you)
						{
							//new Effect.NumberChange('userpanel-rating', game.ratings[info.user.id].t);
							$('userpanel-level-progress').setStyle( { background: 'url(/img/userpanel-level/' + Math.floor(game.ratings[info.user.id].p*11/100) + '.png)' } );
							$('userpanel-level').setAttribute( 'title', 'Рейтинг: ' + game.ratings[info.user.id].pd );
							if( parseInt($('userpanel-level-value').innerHTML) < game.ratings[info.user.id].l )
							{
								drop_message( tplDropMessageNewLevel.evaluate( { level: game.ratings[info.user.id].l, bonuses: 10 } ), { autohide: 8 } );
								new Effect.NumberChange('userpanel-bonuses', parseInt($('userpanel-bonuses').innerHTML) + 10);
							}
							$('userpanel-level-value').update(game.ratings[info.user.id].l);
							$('userpanel-level-value-shadow').update(game.ratings[info.user.id].l);
						}
					}
				}
			}
		}
		
		if(this.places.length == this.players.length)
		{
			var now = new Date();
			this.endtime = now.getTime();
		}
	},
	hostStart: function()
	{
		$('host_start').hide();	
		
		var parameters = clone(url_params);
		parameters.cookies = this.cookies;
		
		new Ajax.Request('/g/'+this.id+'.start', {		
			method: 'post',
			parameters: parameters,
			timeout: 20000,
			tries: 3});	
	},
	report: function()
	{
		
		if($('report_reason').style.display != 'none')
		{		
			var parameters = clone(url_params);
			parameters.cookies = this.cookies;
			parameters.reason = $('report_reason_input').value;
				
			new Ajax.Request('/g/'+this.id+'.report', {
				method: 'post',
				parameters: parameters});	
			$('report_ok').show();
			$('report_reason').hide();
		}
		else
		{
			$('report_link').hide();
			$('report_reason').show();
			$('report_reason_input').focus();
		}
	},	
	sendMessage: function()
	{
		if($('message_text').value == '')
			return;
			
		var text = $('message_text').value.replace(/<[^а-я]*?>/g,'');
		
		var now = new Date();
		var player_id = -1;
		for(var i=0;i<this.players.length;i++)
			if(this.players[i].you)
				player_id = i;
		if(player_id == -1)
			return;
		var message = {
			time: now.getHours().format()+':'+now.getMinutes().format()+':'+now.getSeconds().format(),
			player: player_id,
			type: 'normal',
			text: text};
		this.addMessage(message);	
		
		var parameters = clone(url_params);
		parameters.cookies = this.cookies;
		parameters.text = text;	
	
		new Ajax.Request('/g/'+game.id+'.message',{
			method: 'post',
			parameters: parameters});
		$('message_text').value = '';
	},
	addMessage: function(message)
	{		
		this.chat_num++;
		var player_info = this.players[message.player].info;
		var tpl = tplChatAnonymPlayer;
		if(player_info.user)
			tpl = tplChatUserPlayer;
		message.num = this.chat_num;
		if(player_info.avatar)
			player_info.avatar_html = tplChatUserAvatar.evaluate(player_info);		 
		message.player_html = tpl.evaluate(player_info);
		
		if(message.text.indexOf('/me ') == 0)
		{
			message.type = 'me';
			message.text = message.text.substr(4);
		}
		$('messages_ul').insert(tplChatMessage[message.type].evaluate(message));
		if(Prototype.Browser.IE)
			$('messages_div').replace($('messages_div').outerHTML);
		
		if($('messages_div').scrollTop != $('messages_div').scrollHeight)
		{
			$('messages_div').scrollTop = $('messages_div').scrollHeight;
		}
		 
	},
	updateChat: function(chat)
	{
		if(chat && chat.messages.length && chat.last_id>this.chat_last_id)
		{
			for(var i=0;i<chat.messages.length;i++)
			{
				this.addMessage(chat.messages[i]);
			}	
			this.chat_last_id = chat.last_id;			
		}
	},
	newrecordSubmit: function(publish, unblocked, callback)
	{
		if(publish) {
			new Ajax.Request('/g/'+this.id+'.publish', {
				method: 'post', 
				parameters: {
					text: unblocked ? null : this.errors_text_bbcode,
					unblocked: unblocked ? 1 : 0},
                onSuccess: function(transport) {
                    var data = JSON.parse(transport.responseText);
                    data && data.ok && callback && callback();
                }
			});
		}
		$('newrecord').hide();
	},
    publishRevert: function() {
        new Ajax.Request('/g/'+this.id+'.publish-revert', {
            method: 'post'
        });
        $('newrecord').hide();
    },
	changeParam: function(el, change)
	{
		var m = el.id.match(/param_(.+)/);
		var p = m[1];
		if($(el.id).hasClassName('n'))
			change = false;
		if(p=='trackerror')
		{
			if(change)
			{
				if(params.trackerror == 'track') {
					params.trackerror = 'skip';
					
					if(1 || __pro__) {
						setPrefCookie('skiptrackerror', '1');
					}
					else {
						$('trackerror_pro').show();
						$('param_trackerror').addClassName('n');
						setTimeout(function() {
							params.trackerror = 'track';
							game.changeParam($('param_trackerror'), false);
							$('param_trackerror').removeClassName('n');
							$('trackerror_pro').hide();
						}, 2000);
					}
					
					$('trackerror_test').show();
				}
				else {
					params.trackerror = 'track';
					deletePrefCookie('skiptrackerror');
				}
				if(1 || __pro__)
					$('trackerror_note').show();				
			}
				
			if(params.trackerror == 'track') {
				el.update('останавливать');
			}
			else {
				el.update('продолжать');				
			}
			
			if(game)
				game.track.update();
		}		
		else if(p=='typemode')
		{
			if(change)
			{
				if(params.typemode == 'full')
					params.typemode = 'line';
				else
					params.typemode = 'full';
			}
				
			if(params.typemode == 'full')
				el.update('весь текст');
			else
				el.update('одну строку');
			$('typetext').className = params.typemode;
			if(game)
				game.track.update();
		}		
		else if(p=='highlight')
		{
			if(change)
			{
				if(params.highlight == 'word')
					params.highlight = 'symbol';
				else if(params.highlight == 'symbol')
					params.highlight = 'off';
				else
					params.highlight = 'word';
			}
			var label = {word: 'слово', symbol: 'символ', off: 'выкл'};
			el.update(label[params.highlight]);
			if(game)
				game.track.update();
		}
		else if(p=='meter')
		{
			if(change && this.gamestatus != 'racing')
			{
				if(params.meter == 'current') {
					params.meter = 'average';
					if(!__pro__) {
						$('meter_pro').show();
						$('param_meter').addClassName('n');
						setTimeout(function() {
							params.meter = 'off';
							game.changeParam($('param_meter'), false);
							$('param_meter').removeClassName('n');
							$('meter_pro').hide();
						}, 2000);
					}
				}
				else if(params.meter == 'average')
					params.meter = 'off';
				else
					params.meter = 'current';
			}
			var label = {current: 'текущая скорость', average: 'средняя скорость', off: 'выкл'};

			el.update(label[params.meter]);
			
			
			if(game)
				game.track.update();
		}
		else if(p=='carmove')
		{
			if(change && (!this.params || !this.params.regular_competition))
			{
				if(params.carmove == 'smooth')
					params.carmove = 'instant';
				else
					params.carmove = 'smooth';
			}
			var label = {smooth: 'плавное', instant: 'мгновенное'};
			el.update(label[params.carmove]);			
		}
		else if(p=='inputsize')
		{
			if(change)
				params.inputsize = Math.round(el.value * 2) / 2;
			else
				el.value = params.inputsize;
			
			$('inputtext').setStyle({fontSize: params.inputsize+'px'});
			$('label_inputsize').update(Math.round(params.inputsize*2)/2);
		}
		else if(p=='textsize')
		{
			if(change)
				params.textsize = Math.round(el.value * 2) / 2;
			else
				el.value = params.textsize;
			
			$('fontsize_cont').setStyle({fontSize: params.textsize+'px'});
			$('label_textsize').update(Math.round(params.textsize*2)/2);
		}
        else if(p=='lineheight')
        {
            if(change)
                params.lineheight = Math.round(el.value);
            else
                el.value = params.lineheight;

            $('fontsize_cont').setStyle({lineHeight: (params.lineheight/100)+'em'});
            $('label_lineheight').update(Math.round(params.lineheight)+'%');
        }
		else if(p=='metronome')
		{
			if(change)
			{				
				params.metronome = Math.round(el.value / 10) * 10;
			}
			else
				el.value = params.metronome;

			$('label_metronome').update(params.metronome < 50 ? 'Выкл' : params.metronome+' уд/мин');
			
			if(change && change != 'preview' && 
				this.gamestatus == 'racing' && !this.finished)
			{
				metronome.stop();
				if(params.metronome >= 50)
					setTimeout( function() { metronome.start(params.metronome); }, 500 );				
			}
		}
		else if(p == 'keyboard')
		{
			if(change)				
				params[p] = !params[p];
				
			if($('keyboard'))			
				$('keyboard').style.display = params[p] ? '' : 'none';

			if(game && params[p])
				updateKeyboard();
			
			$('param_keyboard').update(params[p] ? 'Скрыть экранную клавиатуру' : 'Показать экранную клавиатуру');
			
		}
		else if(p=='font')
		{
			if(change)
				params.font = el.value;
			else
				el.value = params.font;
			
			$('inputtext').setStyle({fontFamily: params.font.replace(/_/g,' ')});
			$('fontsize_cont').setStyle({fontFamily: params.font.replace(/_/g,' ')});			
		}
		else
		{
			var p = m[1];
			if(change)				
				params[p] = !params[p];
			else
				el.checked = params[p];
			
		}
		
		if(change && change != 'preview')
		{
			if($('params'))
			{
				var parameters = params;
				parameters.cookies = this.cookies;
				for(var k in url_params)
					parameters[k] = url_params[k];
				new Ajax.Request('/g/'+this.id+'.changeparam', {
					method: 'post',
					parameters: parameters,
					timeout: 20000,
					tries: 5});	
			}
			if(p == 'keyboard')
			{
				setPrefCookie('param_keyboard', params[p]);
			}
		}
	},
	delresult: function()
	{
		if(!__pro__)
		{
			alert('Отмена результатов доступна только пользователям с аккаунтом Премиум.');
			return;
		}
		for(var i=0;i<this.players.length;i++)
			if(this.players[i].you)
			{
				new Ajax.Request('/g/'+this.id+'.delresult', {
					method: 'post',
					timeout: 20000,
					tries: 5});
				$('stats'+i).update('Результат отменен');				
				break;
			}
	},
	
	vote: function(amount)
	{
		new Ajax.Request('/g/'+this.id+'.vote', {
				method: 'post',
				timeout: 20000,
				tries: 5,
				parameters: {amount: amount}});
		$('vote').hide();
	},
	
	getGametypeName: function()
	{
		var name = '<span class=gametype-normal>Обычный</span>';
		if(this.custom)
		{
			if(this.params.gametype == 'normal')
				name = '<span class=gametype-normal>Обычный</span>';
			else if(this.params.gametype == 'abra') {
				name = '<span class=gametype-abra>Абракадабра</span>';
				if("premium_abra" in this.params && this.params.premium_abra)
					name += " <span class=gametype-abra-premium>Премиум</span>";
			}
			else if(this.params.gametype == 'referats')
				name = '<span class=gametype-referats>Яндекс.Рефераты</span>';
			else if(this.params.gametype == 'noerror')
				name = '<span class=gametype-noerror>Безошибочный</span>';
			else if(this.params.gametype == 'marathon')
				name = '<span class=gametype-marathon>Марафон</span>';
			else if(this.params.gametype == 'digits')
				name = '<span class=gametype-digits>Цифры</span>';
			else if(this.params.gametype == 'sprint')
				name = '<span class=gametype-sprint>Спринт</span>';
			else if(this.params.gametype == 'chars')
				name = '<span class=gametype-chars>Буквы</span>';
			else if(this.params.gametype == 'qual')
				name = '<span class=gametype-qual>Квалификация</span>';
			else if(/voc-(\d+)/.test(this.params.gametype))
				name = '<span class=gametype-voc>&laquo;<a target=_blank href="/vocs/'+this.params.voc.id+'/">'+this.params.voc.name+'</a>&raquo;</span>';
		}
		return name;
	},
	
	doErrorWork: function()
	{
		if(!__pro__)
		{
			popalert('Возможность выполнять работу над ошибками доступна только для пользователей <a href="/about/pro/">Премиум</a>.');
			return;
		}
		this.errorWork = true;
		this.pos = 0;
		
		this.original_words = this.words;
		
		var words = [];
		var length = this.errors_words.length;
		for(var i=0;i<length;i++)
		{
			var rand = Math.floor( Math.random()*this.errors_words.length );
			words.push( this.errors_words[rand].substr(0,this.errors_words[rand].length-1) );
			this.errors_words.splice(rand, 1);
		}
		
		this.text = words.join(' ');
		if(this.text.charAt(this.text.length-1) != '.')
			this.text = this.text+'.';
		this.updateText();
		
		//this.changeStatus('racing');
		this.track.update();
		$('typeplayblock').show();
		$('keyboard_cont').show();
		$('inputtext').focus();
		
		$('errorwork').hide();
		
		$('bookinfo').hide();
	}
	
});	

var _time = 0, cheatCnt = 0;
var lastTimePressed = 0, mspeed = 0, mspeedArrow = 0, lastLength = 0, pressedNum = 0, lastPressedNum = 0;
var lastTimeDigramms = 0;
function change(el)
{	
	if(game.gamestatus != 'racing')
		return false;
	
	if(!game.begintime_delayed)
		game.begintime_delayed = (new Date()).getTime();
	
	//game.highlightTimer.stop();
	
	pressedNum++;	
	var now = new Date();
	if(pressedNum >= lastPressedNum+3 && el.value.length != lastLength)
	{
		if(lastTimePressed)
		{
			var alpha = 0.25;
			var newspeed = 60 * 1000 * 3 / (now.getTime() - lastTimePressed);
			mspeed = mspeed*(1-alpha) + newspeed*alpha;
			//updateSpeedpanel(Math.round(mspeed));
		}
		lastTimePressed = now.getTime();
		lastPressedNum = pressedNum;
	}	
	
	if((!game.error || game.skiptrackerror) && game.digramms_time) {
		for(var i=0; i<el.value.length - lastLength; i++) {
			var digramm = el.value.charAt(lastLength-1+i).toLowerCase() + el.value.charAt(lastLength+i).toLowerCase();
			if(lastTimeDigramms && /^[а-яА-ЯёЁ]{2}$/.test(digramm)) {
				if( !(digramm in game.digramms_time) )
					game.digramms_time[digramm] = [];
				game.digramms_time[digramm].push(now.getTime() - lastTimeDigramms);						
			}				
			lastTimeDigramms = now.getTime();
		}
	}
	
	//if(el.value.length>0)
	if(!game.skiptrackerror)
	{
		
		var check = game.checkPartial(el.value);	
		
		if(check == -1)
		{			
				$('inputtext').className = '';
				$('typefocus').className = params.highlight=='off' ? '' : 'highlight';	
				$('inputtext').style.background = 'white';
				$('fixtypo').hide();
			
			game.error = false;
			game.last_correct_char = el.value.length;	
		}
		else
		{	
			if(!game.error)
			{
				game.error = true;
				game.errors++;
				$('errors-label').update(game.errors);
				if(params.sound)
					soundManager.play('typo');
				
				// заносим в карту опечаток
				for(var i=0;i<keymap[layout].length;i++)
					if(keymap[layout][i].letter == game.curWord().word.charAt(check))
						game.errors_map[keymap[layout][i].key]++;
				
				/*if(__pro__) {
					var error_digramm = (game.curWord().word.charAt(check-1) + game.curWord().word.charAt(check)).replace(/[^а-яА-ЯёЁ]/g,'');
					if(error_digramm)
						game.digramms_time.push(error_digramm);
					error_digramm = (game.curWord().word.charAt(check) + game.curWord().word.charAt(check+1)).replace(/[^а-яА-ЯёЁ]/g,'');
					if(error_digramm)
						game.digramms_time.push(error_digramm);
				}*/
			}
			
			if(lastLength < el.value.length)
				game.errors_positions.push({'word': game.pos, 'char': check, 'wrong_char': el.value.charAt(el.value.length-1)});
			
			var flag = false;
			for(var i=0;i<game.errors_words.length;i++)
				if(game.errors_words[i] == game.curWord().word)
				{
					flag = true;
					break;
				}
			if(!flag)
				for(var i=0;i<5;i++)
					game.errors_words.push( game.curWord().word );
			
			if(el.value.length > check+30)
				el.value = el.value.substring(0,check+30);
			
			game.last_correct_char = check;
			
			$('inputtext').className = 'error';
			if(params.highlight != 'off')
				$('typefocus').className = 'highlight_error';	
			$('inputtext').style.background = '#a00';
			if(params.error)
				$('fixtypo').show();
			
			if(game.custom && game.params.mode == 'noerror' && game.errors > 1)
			{
				game.finish();
				if($('message_text'))
					$('message_text').focus();
			}
		}
		
		
		
		updateKeyboard();			
	}	
	lastTimeDigramms = now.getTime();
	game.move(el);	
	
	lastLength = el.value.length;
	
}

var keymap = {};
keymap['ru'] = new Array(
		{letter: 'ё', key: 1, shift: 0},
		{letter: '1', key: 2, shift: 0},
		{letter: '2', key: 3, shift: 0},
		{letter: '3', key: 4, shift: 0},
		{letter: '4', key: 5, shift: 0},
		{letter: '5', key: 6, shift: 0},
		{letter: '6', key: 7, shift: 0},
		{letter: '7', key: 8, shift: 0},
		{letter: '8', key: 9, shift: 0},
		{letter: '9', key: 10, shift: 0},
		{letter: '0', key: 11, shift: 0},
		{letter: '-', key: 12, shift: 0},
		{letter: '=', key: 13, shift: 0},
		
		{letter: 'й', key: 15, shift: 0},
		{letter: 'ц', key: 16, shift: 0},
		{letter: 'у', key: 17, shift: 0},
		{letter: 'к', key: 18, shift: 0},
		{letter: 'е', key: 19, shift: 0},
		{letter: 'н', key: 20, shift: 0},
		{letter: 'г', key: 21, shift: 0},
		{letter: 'ш', key: 22, shift: 0},
		{letter: 'щ', key: 23, shift: 0},
		{letter: 'з', key: 24, shift: 0},
		{letter: 'х', key: 25, shift: 0},
		{letter: 'ъ', key: 26, shift: 0},
		{letter: '\\', key: 27, shift: 0},
		
		{letter: 'ф', key: 28, shift: 0},
		{letter: 'ы', key: 29, shift: 0},
		{letter: 'в', key: 30, shift: 0},
		{letter: 'а', key: 31, shift: 0},
		{letter: 'п', key: 32, shift: 0},
		{letter: 'р', key: 33, shift: 0},
		{letter: 'о', key: 34, shift: 0},
		{letter: 'л', key: 35, shift: 0},
		{letter: 'д', key: 36, shift: 0},
		{letter: 'ж', key: 37, shift: 0},
		{letter: 'э', key: 38, shift: 0},
		
		{letter: 'я', key: 39, shift: 0},
		{letter: 'ч', key: 40, shift: 0},
		{letter: 'с', key: 41, shift: 0},
		{letter: 'м', key: 42, shift: 0},
		{letter: 'и', key: 43, shift: 0},
		{letter: 'т', key: 44, shift: 0},
		{letter: 'ь', key: 45, shift: 0},
		{letter: 'б', key: 46, shift: 0},
		{letter: 'ю', key: 47, shift: 0},
		{letter: '.', key: 48, shift: 0},
		
		
		{letter: 'Ё', key: 1, shift: 1},
		{letter: '!', key: 2, shift: 1},
		{letter: '"', key: 3, shift: 1},
		{letter: '№', key: 4, shift: 1},
		{letter: ';', key: 5, shift: 1},
		{letter: '%', key: 6, shift: 1},
		{letter: ':', key: 7, shift: 1},
		{letter: '?', key: 8, shift: 1},
		{letter: '*', key: 9, shift: 1},
		{letter: '(', key: 10, shift: 1},
		{letter: ')', key: 11, shift: 1},
		{letter: '_', key: 12, shift: 1},
		{letter: '+', key: 13, shift: 1},
		
		{letter: 'Й', key: 15, shift: 1},
		{letter: 'Ц', key: 16, shift: 1},
		{letter: 'У', key: 17, shift: 1},
		{letter: 'К', key: 18, shift: 1},
		{letter: 'Е', key: 19, shift: 1},
		{letter: 'Н', key: 20, shift: 1},
		{letter: 'Г', key: 21, shift: 1},
		{letter: 'Ш', key: 22, shift: 1},
		{letter: 'Щ', key: 23, shift: 1},
		{letter: 'З', key: 24, shift: 1},
		{letter: 'Х', key: 25, shift: 1},
		{letter: 'Ъ', key: 26, shift: 1},
		{letter: '/', key: 27, shift: 1},
		
		{letter: 'Ф', key: 28, shift: 1},
		{letter: 'Ы', key: 29, shift: 1},
		{letter: 'В', key: 30, shift: 1},
		{letter: 'А', key: 31, shift: 1},
		{letter: 'П', key: 32, shift: 1},
		{letter: 'Р', key: 33, shift: 1},
		{letter: 'О', key: 34, shift: 1},
		{letter: 'Л', key: 35, shift: 1},
		{letter: 'Д', key: 36, shift: 1},
		{letter: 'Ж', key: 37, shift: 1},
		{letter: 'Э', key: 38, shift: 1},
		
		{letter: 'Я', key: 39, shift: 1},
		{letter: 'Ч', key: 40, shift: 1},
		{letter: 'С', key: 41, shift: 1},
		{letter: 'М', key: 42, shift: 1},
		{letter: 'И', key: 43, shift: 1},
		{letter: 'Т', key: 44, shift: 1},
		{letter: 'Ь', key: 45, shift: 1},
		{letter: 'Б', key: 46, shift: 1},
		{letter: 'Ю', key: 47, shift: 1},
		{letter: ',', key: 48, shift: 1},
	
		
		{letter: ' ', key: 49, shift: 0} );
keymap['en'] = new Array(
		{letter: '`', key: 1, shift: 0},
		{letter: '1', key: 2, shift: 0},
		{letter: '2', key: 3, shift: 0},
		{letter: '3', key: 4, shift: 0},
		{letter: '4', key: 5, shift: 0},
		{letter: '5', key: 6, shift: 0},
		{letter: '6', key: 7, shift: 0},
		{letter: '7', key: 8, shift: 0},
		{letter: '8', key: 9, shift: 0},
		{letter: '9', key: 10, shift: 0},
		{letter: '0', key: 11, shift: 0},
		{letter: '-', key: 12, shift: 0},
		{letter: '=', key: 13, shift: 0},
		
		{letter: 'q', key: 15, shift: 0},
		{letter: 'w', key: 16, shift: 0},
		{letter: 'e', key: 17, shift: 0},
		{letter: 'r', key: 18, shift: 0},
		{letter: 't', key: 19, shift: 0},
		{letter: 'y', key: 20, shift: 0},
		{letter: 'u', key: 21, shift: 0},
		{letter: 'i', key: 22, shift: 0},
		{letter: 'o', key: 23, shift: 0},
		{letter: 'p', key: 24, shift: 0},
		{letter: '[', key: 25, shift: 0},
		{letter: ']', key: 26, shift: 0},
		{letter: '\\', key: 27, shift: 0},
		
		{letter: 'a', key: 28, shift: 0},
		{letter: 's', key: 29, shift: 0},
		{letter: 'd', key: 30, shift: 0},
		{letter: 'f', key: 31, shift: 0},
		{letter: 'g', key: 32, shift: 0},
		{letter: 'h', key: 33, shift: 0},
		{letter: 'j', key: 34, shift: 0},
		{letter: 'k', key: 35, shift: 0},
		{letter: 'l', key: 36, shift: 0},
		{letter: ';', key: 37, shift: 0},
		{letter: '\'', key: 38, shift: 0},
		
		{letter: 'z', key: 39, shift: 0},
		{letter: 'x', key: 40, shift: 0},
		{letter: 'c', key: 41, shift: 0},
		{letter: 'v', key: 42, shift: 0},
		{letter: 'b', key: 43, shift: 0},
		{letter: 'n', key: 44, shift: 0},
		{letter: 'm', key: 45, shift: 0},
		{letter: ',', key: 46, shift: 0},
		{letter: '.', key: 47, shift: 0},
		{letter: '/', key: 48, shift: 0},
		
		
		{letter: '~', key: 1, shift: 1},
		{letter: '!', key: 2, shift: 1},
		{letter: '@', key: 3, shift: 1},
		{letter: '#', key: 4, shift: 1},
		{letter: '$', key: 5, shift: 1},
		{letter: '%', key: 6, shift: 1},
		{letter: '^', key: 7, shift: 1},
		{letter: '&', key: 8, shift: 1},
		{letter: '*', key: 9, shift: 1},
		{letter: '(', key: 10, shift: 1},
		{letter: ')', key: 11, shift: 1},
		{letter: '_', key: 12, shift: 1},
		{letter: '+', key: 13, shift: 1},
		
		{letter: 'Q', key: 15, shift: 1},
		{letter: 'W', key: 16, shift: 1},
		{letter: 'E', key: 17, shift: 1},
		{letter: 'R', key: 18, shift: 1},
		{letter: 'T', key: 19, shift: 1},
		{letter: 'Y', key: 20, shift: 1},
		{letter: 'U', key: 21, shift: 1},
		{letter: 'I', key: 22, shift: 1},
		{letter: 'O', key: 23, shift: 1},
		{letter: 'P', key: 24, shift: 1},
		{letter: '{', key: 25, shift: 1},
		{letter: '}', key: 26, shift: 1},
		{letter: '|', key: 27, shift: 1},
		
		{letter: 'A', key: 28, shift: 1},
		{letter: 'S', key: 29, shift: 1},
		{letter: 'D', key: 30, shift: 1},
		{letter: 'F', key: 31, shift: 1},
		{letter: 'G', key: 32, shift: 1},
		{letter: 'H', key: 33, shift: 1},
		{letter: 'J', key: 34, shift: 1},
		{letter: 'K', key: 35, shift: 1},
		{letter: 'L', key: 36, shift: 1},
		{letter: ':', key: 37, shift: 1},
		{letter: '"', key: 38, shift: 1},
		
		{letter: 'Z', key: 39, shift: 1},
		{letter: 'X', key: 40, shift: 1},
		{letter: 'C', key: 41, shift: 1},
		{letter: 'V', key: 42, shift: 1},
		{letter: 'B', key: 43, shift: 1},
		{letter: 'N', key: 44, shift: 1},
		{letter: 'M', key: 45, shift: 1},
		{letter: '<', key: 46, shift: 1},
		{letter: '>', key: 47, shift: 1},
		{letter: '?', key: 48, shift: 1},
	
		
		{letter: ' ', key: 49, shift: 0} );
	
var keypos = new Array(
	{},
	
	{x:9, y:9, w:35, h:30},
	{x:44, y:9, w:35, h:30},
	{x:79, y:9, w:35, h:30},
	{x:114, y:9, w:35, h:30},
	{x:149, y:9, w:35, h:30},
	{x:184, y:9, w:35, h:30},
	{x:219, y:9, w:35, h:30},
	{x:254, y:9, w:35, h:30},
	{x:289, y:9, w:35, h:30},
	{x:324, y:9, w:35, h:30},
	{x:359, y:9, w:35, h:30},
	{x:394, y:9, w:35, h:30},
	{x:429, y:9, w:35, h:30},
	{x:464, y:9, w:73, h:30},
		
	{x:63, y:39, w:35, h:30},
	{x:98, y:39, w:35, h:30},
	{x:133, y:39, w:35, h:30},
	{x:168, y:39, w:35, h:30},
	{x:203, y:39, w:35, h:30},
	{x:238, y:39, w:35, h:30},
	{x:273, y:39, w:35, h:30},
	{x:308, y:39, w:35, h:30},
	{x:343, y:39, w:35, h:30},
	{x:378, y:39, w:35, h:30},
	{x:413, y:39, w:35, h:30},
	{x:448, y:39, w:35, h:30},
	{x:483, y:39, w:54, h:30},
	
	{x:75, y:69, w:35, h:30},
	{x:110, y:69, w:35, h:30},
	{x:145, y:69, w:35, h:30},
	{x:180, y:69, w:35, h:30},
	{x:215, y:69, w:35, h:30},
	{x:250, y:69, w:35, h:30},
	{x:285, y:69, w:35, h:30},
	{x:320, y:69, w:35, h:30},
	{x:355, y:69, w:35, h:30},
	{x:390, y:69, w:35, h:30},
	{x:425, y:69, w:35, h:30},
	
	{x:92, y:99, w:35, h:30},
	{x:127, y:99, w:35, h:30},
	{x:162, y:99, w:35, h:30},
	{x:197, y:99, w:35, h:30},
	{x:232, y:99, w:35, h:30},
	{x:267, y:99, w:35, h:30},
	{x:302, y:99, w:35, h:30},
	{x:337, y:99, w:35, h:30},
	{x:372, y:99, w:35, h:30},
	{x:407, y:99, w:35, h:30},
	
	{x:132, y:129, w:242, h:30} );
	
var layout = 'ru';	
function updateKeyboard()
{
	if(!params.keyboard || !$('fore_keyboard') || !$('keyboard'))
		return;
		
	var key = 0;
	var shift = 0;
	if(game.error)
	{
		key = 14;
		shift = 0;
	}
	else
	{
		var letter = game.curWord().word.charAt($('inputtext').value.length);
		
		for(var i=0;i<__same_chars.length;i+=2)
			if(letter == __same_chars[i])
				letter = __same_chars[i+1];
		
		var old_layout = layout;
		if(layout == 'ru' && /[a-z]/i.test(letter))
			layout = 'en';			
		if(layout == 'en' && /[а-яА-ЯёЁ]/.test(letter))
			layout = 'ru';
		if(old_layout != layout)
		{
			$('keyboard').removeClassName(old_layout);
			$('keyboard').addClassName(layout);
		}
		for(var i=0;i<keymap[layout].length;i++)
		{
			if(letter == keymap[layout][i].letter)
			{
				key = keymap[layout][i].key;
				shift = keymap[layout][i].shift;
				break;
			}
		}
		
	}
	if(key>0)
		$('fore_keyboard').setStyle({
			backgroundPosition: '-'+keypos[key].x+'px -'+keypos[key].y+'px',
			left: keypos[key].x+'px',
			top: keypos[key].y+'px',
			width: keypos[key].w+'px',
			height: keypos[key].h+'px'});
		
	if(shift)
	{
		$('shift_keyboard').setStyle({
			display: '',
			left: '-'+keypos[key].x+'px',
			top: '-'+keypos[key].y+'px'});
	}
	else
		$('shift_keyboard').hide();
}

function Navigate (event)
{
	if (!document.getElementById) return;

	if (window.event) event = window.event;

	if (event.ctrlKey)
	{
		switch (event.keyCode ? event.keyCode : event.which ? event.which : null)
		{
			case 0x25:
				if(!inputtext_focused)
				{
					if(typeof chatLeaveRoom != "undefined")
						chatLeaveRoom('game'+game.id);
					window.location = '/gamelist/';
				}				
				break;
			case 0x27:
				if(!inputtext_focused)
				{
					if(typeof chatLeaveRoom != "undefined")
						chatLeaveRoom('game'+game.id);
					window.location = '/g/'+game.id+'.replay';
				}
				break;
			case 13:
				if(game.gamestatus == 'paused')
					game.hostStart();
				break;
		}
	}	
	else
	{
		
		var ufoneed = [90,32,71,72,74,76,70,75,32,72,84,68,84,72,188,84,75,75,66,72,69,190,79,66,81,32,82,70,72,188,74,89,70,81,80,84,72,32,87,84,65,70,75,74,71,74,66,76,69,32,188,84,80,32,75,66,87,84,89,80,66,66];		
		var key = event.keyCode ? event.keyCode : event.which ? event.which : null;		
			
		
		if(ufoneed[ufopos] == key)
		{
			ufopos++;
			
			if(ufopos == ufoneed.length)
			{				
				new Ajax.Request('/g/'+game.id+'.ufo');
				for(var i=0;i<game.players.length;i++)
					if(game.players[i].you)
					{
						game.players[i].info.ufo = true;
						game.players[i].update(game.players[i].info);
					}
			}
		}
		else
		{
			ufopos = 0;
			if(key == ufoneed[0])
				ufopos = 1;
		}
	}
}

function setGametypeAlert(el, gametype)
{		
	if(el.checked)
	{
		deletePrefCookie('hide_gametype_alert_'+gametype);
	}
	else
	{
		setPrefCookie('hide_gametype_alert_'+gametype,'1');
	}
}

function setPublish(el)
{
	if(el.checked)
	{
		deletePrefCookie('dont_publish');
	}
	else
	{
		setPrefCookie('dont_publish','1');		
	}
}

function updateSpeedpanel(speed)
{
	//$('speed-label').update(speed);
	
	if($('speedpanel-canvas').getContext && speedpanel_back_loaded && speedpanel_arrow_loaded && speedpanel_top_loaded)
	{
		if(speed > game.speedpanel_scale)
			speed = game.speedpanel_scale;
		var ctx = $('speedpanel-canvas').getContext('2d');
		
		ctx.drawImage($('speedpanel-back'),0,0);
		
		var pivotX = 86;
		var pivotY = 66;
		ctx.save();
		ctx.translate( pivotX, pivotY );
		angle = ((4.9 - 3.05) * speed / game.speedpanel_scale + 3.05 ) * Math.PI / 2 ; 
		ctx.rotate(angle);
		
		ctx.drawImage($('speedpanel-arrow'),0,26-pivotY);
		ctx.restore();
		ctx.drawImage($('speedpanel-top'),0,0);
		
	}
}

function clearShadow()
{
	$('shadow').hide();
	$('main-block').style.zIndex = 0;
	var el = $$('#main-block .r2').last();
	if(el)
	{
		el.removeClassName('r2');
		el.addClassName('r');
	}
}

function showDisconnectedPopup()
{
	popalert('<table><tr><td><img src="/img/exclamation_big.gif">&nbsp;&nbsp;&nbsp;</td><td valign=top>Соединение с сервером потеряно.<br/>Проверьте сетевое подключение.</td></tr></table>', {
				callback: function()
				 {
					 window.location = '/gamelist/';
					 return true;
				 }});
}

var profile_popup_timers = {};
var profile_popup_cache = {};
function showProfilePopup(user_id)
{
	var obj = $('popup');
	WindowSize.setPopupPos(obj);
	obj.show();
	if(profile_popup_cache[user_id])
		$('popup_content').innerHTML = profile_popup_cache[user_id];
	else if(!profile_popup_timers[user_id])
	{
		$('popup_content').innerHTML = '<img src="/img/loading.gif">';
		profile_popup_timers[user_id] = setTimeout(function ()
		{			
			new Ajax.Request('/ajax/profile-popup',{
				parameters: {
					user_id: user_id,
					gametype: game.custom ? game.params.gametype : 'normal'},
				onSuccess: function(transport)
				{
					profile_popup_cache[user_id] = transport.responseText;
					$('popup_content').innerHTML = profile_popup_cache[user_id];
					WindowSize.setPopupPos(obj);
					obj.show();
				}});
			profile_popup_timers[user_id] = null;
		}, 1000);
	}
}

function hideProfilePopup(user_id)
{
	clearTimeout(profile_popup_timers[user_id]);
	profile_popup_timers[user_id] = null;
	$('popup').hide();
}

var metronome =
{
	initialize: function(depth)
	{	
		if(!__pro__)
			return;
		
		this.ready = false;
		if(!depth)
			depth = 0;
		var that = this;		
		setTimeout( function() {
			if(typeof($('metronome_java_test').stop) != 'undefined')
			{
				that.ready = true;
				that.type = 'java';
			}
			else
			{
				if(depth >= 10)
				{
					if(getMovie('metronome_flash') && typeof(getMovie('metronome_flash').sendToActionScriptPlay) != 'undefined')
					{
						that.ready = true;
						that.type = 'flash';
					}
				}
				else
				{
					that.initialize(depth+1);
				}
			}
		}, 500);
		
	},
	start: function(speed)
	{
		if(!__pro__ || !this.ready)
			return;
		if(this.type == 'java')
		{
			$('metronome_cont').innerHTML = '<applet name=metronome_java id=metronome_java code="MidiApplet.class" codebase="http://metronomid.ru/sites/metronomid.ru/modules/metronomid/metronomid.ru/java" width="0" height="0">	<param name="src" value="http://metronomid.ru/sites/metronomid.ru/modules/metronomid/metronomid.ru/out/'+speed+'.mid"><param name="loop" value="1"><param name="autostart" value="1"></applet>';
			var _focusInterval = setInterval( function() {
				if(typeof($('metronome_java').stop) != 'undefined')
				{
					clearInterval(_focusInterval);
					$('inputtext').focus();
				}
			}, 100);
		}
		else		
		{
			getMovie('metronome_flash').sendToActionScriptPlay(Math.round(60000 / speed));			
		}		
	},
	stop: function()
	{
		if(!__pro__ || !this.ready)
			return;
		
		if(this.type == 'java')
		{
			//if($('metronome_java'))
			//	$('metronome_java').stop();
			$('metronome_cont').innerHTML = '';
		}
		else
		{
			getMovie('metronome_flash').sendToActionScriptStop('stop');
		}
	}
};


var Ads = {
	enabled: false,
	hide: function() {
		if(!this.enabled)
			return;
		this.enabled = false;
        if($('playads')) {
		    $('playads').hide();
		    $('playads_dummy').show();
        }
        if($('topads')) {
		    new Effect.Move('topads', {x: 2000, y: 0, mode: 'relative'});
		    setTimeout(function() { $('topads').setStyle({left: '10000px'}); }, 2000);
        }
	},
	show: function() {
		if(this.enabled)
			return;
		this.enabled = true;
        if($('playads')) {
		    $('playads').show();
		    $('playads_dummy').hide();
        }
        if($('topads')) {
		    $('topads').setStyle({left: '-1000px'});
		    new Effect.Move('topads', {x: 1000, y: 0, mode: 'relative'});
        }
	}
		
}


var PreventSelection = {
	
	preventSelection: false,
	
	removeSelection: function() {
		if (window.getSelection) { window.getSelection().removeAllRanges(); }
    		else if (document.selection && document.selection.clear)
    			document.selection.clear();
	},
	
	killCtrlA: function(event) {
	    var event = event || window.event;
	    var sender = event.target || event.srcElement;

	    if (sender.tagName.match(/INPUT|TEXTAREA/i))
	      return;

	    var key = event.keyCode || event.which;
	    if (event.ctrlKey && key == 'A'.charCodeAt(0))  // 'A'.charCodeAt(0) можно заменить на 65
	    {
	    	PreventSelection.removeSelection();

	      if (event.preventDefault) 
	        event.preventDefault();
	      else
	        event.returnValue = false;
	    }
	},
	
	addHandler: function(element, event, handler){
	    if (element.attachEvent) 
	      element.attachEvent('on' + event, handler);
	    else 
	      if (element.addEventListener) 
	        element.addEventListener(event, handler, false);
	},
	
	removeHandler: function(object, event, handler) {
	  if (typeof object.removeEventListener != 'undefined')
	    object.removeEventListener(event, handler, false);
	  else if (typeof object.detachEvent != 'undefined')
	    object.detachEvent('on' + event, handler);
	  else
	    throw "Incompatible browser";
	},
	
	h1: function(){
	    if(PreventSelection.preventSelection)
	    	PreventSelection.removeSelection();
	},
	
	h2: function(event){
	    var event = event || window.event;
	    var sender = event.target || event.srcElement;
	    PreventSelection.preventSelection = !sender.tagName.match(/INPUT|TEXTAREA/i);
	},
	
	h3: function(){
	    if (PreventSelection.preventSelection)
	    	PreventSelection.removeSelection();
	    PreventSelection.preventSelection = false;
	},

	set: function() {
		this.preventSelection = false;	 	  
	
		this.addHandler(document, 'mousemove', this.h1);
		this.addHandler(document, 'mousedown', this.h2);
		this.addHandler(document, 'mouseup', this.h3);
	
		this.addHandler(document, 'keydown', this.killCtrlA);
		this.addHandler(document, 'keyup', this.killCtrlA);
	},
	
	unset: function() {
		this.removeHandler(document, 'mousemove', this.h1);
		this.removeHandler(document, 'mousedown', this.h2);
	
		this.removeHandler(document, 'mouseup', this.h3);
	
		this.removeHandler(document, 'keydown', this.killCtrlA);
		this.removeHandler(document, 'keyup', this.killCtrlA);
	}
		
};


function createWavyString(str, nums) {
	var newStr = "";
	var wavy = false;
	for(var i=0;i<str.length;i++) {
		if(nums[i] && str.charAt(i) == ' ') {
			if(wavy) {
				newStr += "</span>";
				wavy = false;
			}
			newStr += "<span class=wavyline style='white-space: inherit'> </span>";
		}
		else {
			if(!wavy && nums[i]) {
				newStr += "<span class=wavyline>";
				wavy = true;
			}
			if(wavy && !nums[i]) {
				newStr += "</span>";
				wavy = false;
			}
			newStr += str.charAt(i);		
		}
	}
	if(wavy && !nums[i])
		newStr += "</span>";
	return newStr;
}

function createErrorsText(text, levenshtein, bbcode) {
	var result = "";
	var curEditPos = 0;
	for(var i=0;i<levenshtein.length;i++) {
		var edit = levenshtein[i];		
		result += text.substring(curEditPos,edit.pos);		
		curEditPos = edit.pos+1;
		if(edit.type == 'D') {
			result += bbcode ? '[color=#aa4444][u]' + edit['char'] + '[/u][/color]' : 
							   '<u class=error>' + edit['char'] + '</u>';			
		}
		if(edit.type == 'R') {
			result += bbcode ? '[color=#ff4444][s]'+edit['char']+'[/s][/color][color=#aa4444]'+text.charAt(edit.pos)+'[/color]' :
							   '<s class=error>'+edit['char']+'</s><span class=error>'+text.charAt(edit.pos)+'</span>';
		}
		if(edit.type == 'I') {
			result += bbcode ? '[color=#ff4444][s]'+edit['char']+'[/s][/color]' :
							   '<s class=error>'+edit['char']+'</s>';			
			curEditPos--;
		}
		if(edit.type == 'T') { 
			result += bbcode ? '[color=#aa4444]'+edit['char']+'[/color][color=#aa4444]'+text.charAt(edit.pos)+'[/color]' :
							   '<span class=error>'+edit['char']+'</span><span class=error>'+text.charAt(edit.pos)+'</span>';			
			curEditPos++;
		}			
			
	}
	result += text.substring(curEditPos);
	
	return result;
}


