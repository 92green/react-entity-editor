import React from 'react';
import Button from 'bd-stampy/components/Button';
import ProgressBar from 'bd-stampy/components/ProgressBar';
import HumanFileSize from 'trc-client-core/src/utils/HumanFileSize';
import classnames from 'classnames';

var FileUpload = React.createClass({
    displayName: 'FileUpload',
    propTypes: {
        onComplete: React.PropTypes.func,
        onProgress: React.PropTypes.func,
        onSubmit: React.PropTypes.func.isRequired
    },
    getDefaultProps() {
        return {
            progress: 0
        }
    },
    getInitialState() {
        return {
            uploading: false,
            files: []
        }
    },
    onChange() {
        var {files} = this.refs.input;
        this.setState({
            files: Object.keys(files).map(ii => files[ii]),
            uploading: false,
            progress: 0,
            error: null
        });

        if(this.props.onChange) {
            this.props.onChange(this.state);
        }
    },
    onSubmit() {
        this.setState({
            uploading: true,
            error: null
        });

        this.props.onSubmit(this.state);
    },
    render() {
        var {className, multiple} = this.props;
        return (
            <div className={classnames('FileUpload', {'is-chosenFile': this.state.files.length}, className)}>
                {this.renderButton()}
                <input
                    className="FileUpload_input"
                    ref="input"
                    type="file"
                    multiple={multiple}
                    onChange={this.onChange}
                />
                {this.renderProgress()}
                <div className="FileUpload_meta">{this.renderFileInformation()}</div>
            </div>
        );
    },
    renderButton() {
        if(this.state.files.length) {
            return <Button className="FileUpload_button" onClick={this.onSubmit}>
                {this.props.submitting ? 'Uploading...' : 'Upload'}
            </Button>;
        }
    },
    renderProgress() {
        if(this.props.progress !== 0) {
            return <ProgressBar className="FileUpload_progress" value={this.props.progress} />;
        }
    },
    renderFileInformation() {
        var {files} = this.state;
        return files.map(file => {
            const size = HumanFileSize(file.size);
            const text = (this.props.multiple && files.length > 1) ? `${file.name} - ${size}` : size;
            return <div key={file.name}>{text}</div>;
        });
    }
});

export default FileUpload;
