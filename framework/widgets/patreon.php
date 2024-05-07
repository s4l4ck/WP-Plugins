<?php

if( ! class_exists( 'TIE_PATREON_WIDGET' ) ) {

	/**
	 * Widget API: TIE_PATREON_WIDGET class
	 */
	 class TIE_PATREON_WIDGET extends WP_Widget {


		public function __construct(){
			parent::__construct( 'tie-patreon-widget', apply_filters( 'TieLabs/theme_name', 'TieLabs' ) .' - '.esc_html__( 'Patreon', TIELABS_TEXTDOMAIN ) );
		}

		/**
		 * Outputs the content for the widget instance.
		 */
		public function widget( $args, $instance ){


			/** This filter is documented in wp-includes/widgets/class-wp-widget-pages.php */
			$instance['title'] = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base );

			echo ( $args['before_widget'] );

			if ( ! empty( $instance['title'] ) ){
				echo ( $args['before_title'] . $instance['title'] . $args['after_title'] );
			}

			$button_text = ! empty( $instance['button_text'] ) ? $instance['button_text'] : esc_html__( 'Support us on Patreon', TIELABS_TEXTDOMAIN );
			$username    = ! empty( $instance['username'] )    ? $instance['username']    : '';

			?>

			<div class="tie-patreon-badge-wrap">

				<a href="https://www.patreon.com/<?php echo $username ?>" rel="external noopener nofollow" target="_blank">
					<svg width="569px" height="546px" viewBox="0 0 569 546" version="1.1" xmlns="http://www.w3.org/2000/svg"><title><?php echo esc_html( $button_text ) ?></title><g><circle data-color="1" id="Oval" cx="362.589996" cy="204.589996" r="204.589996"></circle><rect data-color="2" id="Rectangle" x="0" y="0" width="100" height="545.799988"></rect></g></svg>
				</a>

				<?php 
					if( ! empty( $instance['secondary_text'] ) ){
						echo '<h4>'. $instance['secondary_text'] .'</h4>';
					} 
				?>

				<a href="https://www.patreon.com/<?php echo $username ?>" rel="external noopener nofollow" target="_blank" class="button">
					<span><?php echo esc_html( $button_text ) ?></span>
				</a>
			</div>

			<?php
			echo ( $args['after_widget'] );
		}

		/**
		 * Handles updating settings for widget instance.
		 */
		public function update( $new_instance, $old_instance ){
			$instance                   = $old_instance;
			$instance['title']          = sanitize_text_field( $new_instance['title'] );
			$instance['button_text']    = sanitize_text_field( $new_instance['button_text'] );
			$instance['secondary_text'] = sanitize_text_field( $new_instance['secondary_text'] );
			$instance['username']       = sanitize_text_field( $new_instance['username'] );

			return $instance;
		}

		/**
		 * Outputs the settings form for the widget.
		 */
		public function form( $instance ){
			$defaults = array( 'title' => esc_html__( 'Support us on Patreon', TIELABS_TEXTDOMAIN ) );
			$instance = wp_parse_args( (array) $instance, $defaults );

			$title          = isset( $instance['title'] )          ? $instance['title']          : '';
			$button_text    = isset( $instance['button_text'] )    ? $instance['button_text']    : '';
			$secondary_text = isset( $instance['secondary_text'] ) ? $instance['secondary_text'] : '';
			$username       = isset( $instance['username'] )       ? $instance['username']       : '';

			?>
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_html_e( 'Title', TIELABS_TEXTDOMAIN) ?></label>
				<input id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" value="<?php echo esc_attr( $title ); ?>" class="widefat" type="text" />
			</p>
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'username' ) ); ?>"><?php esc_html_e( 'Username', TIELABS_TEXTDOMAIN) ?></label>
				<input id="<?php echo esc_attr( $this->get_field_id( 'username' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'username' ) ); ?>" value="<?php echo esc_attr( $username ); ?>" class="widefat" type="text" />
			</p>
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'button_text' ) ); ?>"><?php esc_html_e( 'Button Text', TIELABS_TEXTDOMAIN) ?></label>
				<input id="<?php echo esc_attr( $this->get_field_id( 'button_text' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'button_text' ) ); ?>" value="<?php echo esc_attr( $button_text ); ?>" class="widefat" type="text" />
			</p>
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'secondary_text' ) ); ?>"><?php esc_html_e( 'Secondary Text', TIELABS_TEXTDOMAIN) ?></label>
				<input id="<?php echo esc_attr( $this->get_field_id( 'secondary_text' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'secondary_text' ) ); ?>" value="<?php echo esc_attr( $secondary_text ); ?>" class="widefat" type="text" />
			</p>
			
		<?php
		}
	}



	/**
	 * Register the widget.
	 */
	add_action( 'widgets_init', 'tie_patreon_widget_register' );
	function tie_patreon_widget_register(){
		register_widget( 'TIE_PATREON_WIDGET' );
	}

}