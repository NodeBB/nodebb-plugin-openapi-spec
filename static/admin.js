'use strict';

define('admin/plugins/openapi-spec', ['settings'], function (Settings, autocomplete) {
	var ACP = {};
	ACP.init = function () {
		Settings.load('openapi-spec', $('.openapi-spec-settings'));
		$('#save').on('click', function() {
			Settings.save('openapi-spec', $('.openapi-spec-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'openapi-spec-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function () {
						socket.emit('admin.reload');
					}
				});
			});
		});
	};
	return ACP;
});