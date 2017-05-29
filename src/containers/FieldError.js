import React, { PureComponent } from 'react';
import { P } from 'binary-components';
import AnimatedPopup from './AnimatedPopup';

export default class FieldError extends PureComponent {

  props: {
    text: string,
    show: boolean,
  };

  render() {
    const { text, show } = this.props;

    return (
      <AnimatedPopup shown={show}>
        <P className="error-msg" text={text} />
      </AnimatedPopup>
    );
  }
}
