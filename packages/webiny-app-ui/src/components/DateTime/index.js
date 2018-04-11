import React from "react";
import _ from "lodash";
import { i18n, createComponent } from "webiny-app";
import { FormComponent } from "webiny-app-ui";
import styles from "./styles.css";

class DateTime extends React.Component {
    constructor(props) {
        super(props);
        this.initialized = false;
        this.state = {
            ...props.initialState
        };

        this.init = this.init.bind(this);
    }

    componentDidMount() {
        this.props.attachToForm && this.props.attachToForm(this);
    }

    componentWillReceiveProps(props) {
        if (props.hasOwnProperty("value") && props.value !== this.props.value) {
            this.element.setDate(props.value, false);
        }
    }

    componentWillUnmount() {
        this.element.destroy();
    }

    init(element) {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        const options = _.assign(
            {
                defaultDate: this.props.value,
                enableTime: true,
                time_24hr: true,
                formatDate: date => {
                    return i18n.dateTime(date, this.getInputFormat());
                },
                onChange: values => {
                    let value = values[0];
                    if (value) {
                        value = value.toISOString();
                    }
                    this.props.onChange(value, this.validate);
                }
            },
            this.props.options
        );

        this.element = new this.props.modules.Flatpickr(element, options);
    }

    getInputFormat() {
        return this.props.inputFormat || i18n.getDateTimeFormat();
    }

    render() {
        if (this.props.render) {
            return this.props.render.call(this);
        }

        const { InputLayout } = this.props.modules;

        const props = {
            onBlur: this.props.validate ? this.props.validate : this.props.onBlur,
            disabled: this.props.isDisabled(),
            readOnly: this.props.readOnly,
            type: "text",
            placeholder: this.props.placeholder,
            onChange: this.props.onChange,
            autoFocus: this.props.autoFocus,
            className: styles.input,
            ref: ref => {
                this.init(ref);
                this.props.onRef(ref);
            }
        };

        return (
            <InputLayout
                iconRight="calendar-alt"
                valid={this.state.isValid}
                className={this.props.className}
                input={<input {...props} />}
                label={this.props.renderLabel.call(this)}
                description={this.props.renderDescription.call(this)}
                info={this.props.renderInfo.call(this)}
                validationMessage={this.props.renderValidationMessage.call(this)}
            />
        );
    }
}

DateTime.defaultProps = {
    onRef: _.noop,
    inputFormat: null,
    options: null
};

export default createComponent([DateTime, FormComponent], {
    modules: ["Icon", "InputLayout", { Flatpickr: "Vendor.FlatPickr" }],
    formComponent: true
});
