<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Class Namespace
    |--------------------------------------------------------------------------
    |
    | This value sets the root class namespace for Livewire component classes in
    | your application. This value will change where component auto-discovery
    | finds components. It's generally recommended that you leave this key
    | as "App\Livewire" but you're free to change it if you need to.
    |
    */

    'class_namespace' => 'App\\Livewire',

    /*
    |--------------------------------------------------------------------------
    | View Path
    |--------------------------------------------------------------------------
    |
    | This value sets the path for Livewire component views. This value will
    | change where component auto-discovery finds views. It's generally
    | recommended that you leave this key as "livewire" but you're free
    | to change it if you need to.
    |
    */

    'view_path' => resource_path('views/livewire'),

    /*
    |--------------------------------------------------------------------------
    | Layout
    |--------------------------------------------------------------------------
    |
    | The default layout view that will be used when rendering a component via
    | Route::get('/some-endpoint', SomeComponent::class);. In this case,
    | the layout view will be "layouts.app"
    |
    */

    'layout' => 'components.layouts.app',

    /*
    |--------------------------------------------------------------------------
    | Temporary File Uploads
    |--------------------------------------------------------------------------
    |
    | Livewire handles file uploads by storing uploads in a temporary directory
    | before the file is validated and moved to its final destination. Here
    | you may configure the disk and directory where files are stored.
    |
    */

    'temporary_file_upload' => [
        'disk' => 'public',        // Changed from default (null/default) to 'public'
        'rules' => 'file|max:12288', // 12MB max
        'directory' => 'livewire-tmp',
        'middleware' => null, // 'throttle:60,1'
        'preview_mimes' => [   // Supported file types for temporary previews
            'png', 'gif', 'bmp', 'svg', 'wav', 'mp4',
            'mov', 'avi', 'wmv', 'mp3', 'm4a',
            'jpg', 'jpeg', 'mpga', 'webp', 'wma',
        ],
        'max_upload_time' => 5, // Max duration (in minutes) before an upload gets invalidated.
    ],

    /*
    |--------------------------------------------------------------------------
    | Manifest File Path
    |--------------------------------------------------------------------------
    |
    | This value sets the path to the Livewire manifest file.
    | The default should work for most cases (storage path), but for some
    | read-only environments, like Layer0, you might need to change it.
    |
    */

    'manifest_path' => null,

    /*
    |--------------------------------------------------------------------------
    | Back Button Cache
    |--------------------------------------------------------------------------
    |
    | This value determines whether the back button cache will be used.
    | If set to true, Livewire will store the state of the page in the
    | browser's cache so that when the user hits the back button, the
    | page is restored to its previous state.
    |
    */

    'back_button_cache' => false,

    /*
    |--------------------------------------------------------------------------
    | Render On Redirect
    |--------------------------------------------------------------------------
    |
    | This value determines whether Livewire will render a component's
    | view when a redirect is triggered. This can be useful for
    | preventing flash of unstyled content when redirecting.
    |
    */

    'render_on_redirect' => false,

];
