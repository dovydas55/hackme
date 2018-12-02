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
		if($('#password').val() === atob($('#ssid').val())){
			$( '#loginForm' ).hide();
			$( '#profile' ).show();
			$( '#status' ).show();
		}
		event.preventDefault();
	});

	AddPost("This is working!!");
	AddPost("testing Again");
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
