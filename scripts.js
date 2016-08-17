(function($) {
    /**
     *
     *
     *
     * DON'T FORGET TO IMPLEMENT DRUPAL Drupal.behaviors.kerr125
     *
     *
     *
     */
    $(document).ready(function() {
        $('.nf-vert-steps-wr').vertello({
            elemClass: 'nf-vert-step',
            afterInit: function() {

            },
            beforeAnimate: function() {},
            afterAnimate: function() {},
            finish: function() {
                console.log('priehali');
            }
        });
    });
}(jQuery));