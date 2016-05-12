import React from 'react';
import {connect} from 'react-redux';
import FileUpload from 'trc-client-core/src/components/FileUpload';
import {requestFileUpload} from 'trc-client-core/src/media/FileUploadDuck';

var FileUploadForm = React.createClass({
    displayName: 'FileUploadForm',
    onClick(data) {
        if(this.props.onSubmit) {
            this.props.onSubmit(data, this.onSubmit.bind(null, data))
        } else {
            this.onSubmit(data);
        }
    },
    onSubmit(data) {
        this.props.dispatch(requestFileUpload(data.files, this.onProgress));
    },
    onProgress(ee) {
        console.log('progress',ee);
    },
    render() {
        // const {documentTag} = this.props;
        const {submitting, progress} = this.props;

        return (
            <FileUpload multiple={this.props.multiple} onSubmit={this.onClick} submitting={submitting} progress={progress} />
        );
    }
});

export default connect(
    state => ({course: state.course})
)(FileUploadForm);