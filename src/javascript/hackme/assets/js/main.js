$(document).ready(function () {
	$('[data-toggle=offcanvas]').click(function () {
		$(this).toggleClass('visible-xs text-center');
		$(this).find('i').toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
		$('.row-offcanvas').toggleClass('active');
		$('#lg-menu').toggleClass('hidden-xs').toggleClass('visible-xs');
		$('#xs-menu').toggleClass('visible-xs').toggleClass('hidden-xs');
		$('#btnShow').toggle();
	});

	$( '#loginForm' ).submit(function( event ) {
		if($('#password').val() === atob($('#ssid').val()) && $('#username').val() === atob($('#email').val())){
			$( '#loginForm' ).hide();
			$( '#profile' ).show();
			$( '#status' ).show();
		}
		event.preventDefault();
	});

	AddPost("This election is a total sham and a travesty. We are not a democracy!");
	AddPost("I have never seen a thin person drinking Diet Code");
	AddPost("The conxept of global warming was created by and for the Chinese in order to make U.S. manufacturing non-competitive");
	AddPost("People say my wall idea is crazy. China built a wall, and guess how many Mexicans they have. Checkmate.");
	AddPost("Sorry losers and haters, but my I.Q. is one of the highest -and you all know it. Please dont feel so stupid or insecure, it's not your fault");
	AddPost("@Jesus, such a loser. Washes people's feet. Very dirty. Would be nothing without daddy. Mom wasn't a virgin, needs to be said. SAD.");
	AddPost("Look folks we're going to build a wall made of legos so people will step on them and turn back.");
});


function AddPost(text) {
	$(`<div class="panel panel-post">
		<div class="panel-heading">
			<img src="assets/img/bg_5.jpg" class="img-circle pull-left">
			<a>Harrison Murray</a>
		</div>
		<div class="panel-body">
			<p>${text}</p>
			<hr>
			<form>
				<div class="input-group">
					<div class="input-group-btn">
						<button class="btn btn-default">+1</button><button class="btn btn-default"><i class="glyphicon glyphicon-share"></i></button>
					</div>
					<input class="form-control" placeholder="Add a comment.." type="text">
				</div>
			</form>
		</div>
	</div>`).prependTo('#newsfeed');
}


function SubmitStatus(){
	var textField = $('#status .form-control');
	AddPost(textField.val());
	textField.val("")
	return false;
}
