const Social_user = {
	name: "Roxy Angel",
	img_url:"assets/img/bg_5.jpg"
}

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
			$('#game-result').html('<h2 class="text-success text-center">OWNED!</h2><h6 class="text-center">@@@ Dont be dumb and sacrifice your password @@@</h6>');
		} else {
			$('#game-result').html('<h2 class="text-danger text-center">WRONG USERNAME OR PASSWORD!</h2>');
		}
		$('#postModal').modal('show');
		event.preventDefault();
	});

	AddPost("This election is a total sham and a travesty. We are not a democracy!", Social_user);
	AddPost("I have never seen a thin person drinking Diet Coke", Social_user);
	AddPost("The conxept of global warming was created by and for the Chinese in order to make U.S. manufacturing non-competitive", Social_user);
	AddPost("People say my wall idea is crazy. China built a wall, and guess how many Mexicans they have. Checkmate.", Social_user);
	AddPost("Sorry losers and haters, but my I.Q. is one of the highest -and you all know it. Please dont feel so stupid or insecure, it's not your fault", Social_user);
	AddPost("@Jesus, such a loser. Washes people's feet. Very dirty. Would be nothing without daddy. Mom wasn't a virgin, needs to be said. SAD.", Social_user);
	AddPost("Look folks we're going to build a wall made of legos so people will step on them and turn back.", Social_user);
});


function AddPost(text, user) {
	$(`<div class="panel panel-post">
		<div class="panel-heading">
			<img src="${user.img_url}" class="img-circle pull-left">
			<a>${user.name}</a>
		</div>
		<div class="panel-body">
			<p>${text}</p>
			<hr>
			<form onsubmit="return false">
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
	AddPost(textField.val(), Social_user);
	textField.val("")
	return false;
}
