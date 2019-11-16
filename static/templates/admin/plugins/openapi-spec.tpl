<form role="form" class="openapi-spec-settings">
    <h4>OpenApi Spec Plugin Settings</h4>
    <div class="row">
        <div class="col-sm-6 col-xs-12">
            <div class="form-group">
                <label>Include Pattern</label>
                <input id="includePattern" name="includePattern" type="text" class="form-control" placeholder="category.*">
                 <small class="text-muted">A regexp valid pattern to only include specific paths in the spec response</small>
            </div>
        </div>
        <div class="col-sm-6 col-xs-12">
            <div class="form-group">
                <label>Exclude Pattern</label>
                <input id="excludePattern" name="excludePattern" type="text" class="form-control" placeholder="admin.*">
                 <small class="text-muted">A regexp valid pattern to exclude specific paths in the spec response. By the core logic, only `^/api` paths are shown in the spec.</small>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-6 col-xs-12">
            <div class="form-group">
                <label>Write interval (seconds)</label>
                <input id="writeInterval" name="writeInterval" type="number" min="10" class="form-control" placeholder="60">
                <small class="text-muted">Number of seconds to wait between each "persist" of the spec in the database.</small>
            </div>
        </div>
        <div class="col-sm-6 col-xs-12">
            <div class="form-group">
                <div class="checkbox">
                    <label for="includeResponseBodyExamples">
                        <input type="checkbox" id="includeResponseBodyExamples" name="includeResponseBodyExamples">
                        Include Response Body Examples
                    </label>
                    <p class="help-block">
                        Enabling this option is risks exposing sensitive data in the spec's schema, 
                        since it collects example responses, 
                        which could contain sensitive info.
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12">
            
        </div>
        <div class="col-xs-12">
          <li>
            Spec API link: <a href="{base_url}/api/plugins/openapi-spec/spec" target="_blank">{base_url}/api/plugins/openapi-spec/spec</a>
          </li>
          <li>
            Swagger-UI Page: <a href="{base_url}/api/plugins/openapi-spec/spec" target="_blank">{base_url}/api/plugins/openapi-spec/spec</a>
          </li>
          <li>
              File issues <a href="https://github.com/NodeBB/nodebb-plugin-openapi-spec/issues" target="_blank">here</a>
          </li>
        </div>
    </div>
</form>
<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
    <i class="material-icons">save</i>
</button>