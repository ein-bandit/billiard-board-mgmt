import React from 'react';
import Modal from 'react-modal';
import TableModal from './TableModal';
import SumsModal from './SumsModal';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

export default class TableModalWrapper extends React.Component {

    //types: tables, sums
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            type: '',
            data: {}
        };

        this.closeModal = this.closeModal.bind(this);
    }

    StartModal(type, data) {
        this.setState({
            modalIsOpen: true,
            type: type,
            data: data
        });
    }

    closeModal(evt, table, resume) {
        if (evt.type === 'keydown' && evt.keyCode === 27) return;

        this.setState({ modalIsOpen: false });
        if (resume) {
            this.props.resumeCallback(table);
        }
    }

    closeByKey(evt, resume) {
        if (this.state.type === 'tables') {
            this.closeModal(evt, this.state.data.table, resume);
        } else if (this.state.type === 'sums') {
            resume ? this.closeModal(evt) : this.resetCallback(evt);
        }
    }

    resetCallback(evt) {
        this.props.resetTransactionsCallback();
        this.closeModal(evt)
    }

    render() {

        let innerModal;

        if (this.state.type === 'tables') {
            innerModal = (<TableModal table={this.state.data.table} isRecycle={this.state.data.isRecycle} closeCallback={this.closeModal}></TableModal>);
        } else if (this.state.type === 'sums') {
            innerModal = (<SumsModal sums={this.state.data.sums} resetCallback={(evt) => { this.props.resetTransactionsCallback(); this.closeModal(evt) }} closeCallback={this.closeModal}></SumsModal>)
        }

        let clazzes = this.state.type === 'tables' ? 'tb tb-status-pause tb-single' : 'tb tb-status-final tb-single';
        return (
            <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                contentLabel="Table Stop Modal"
                className={'col-6 ' + clazzes}
                shouldCloseOnOverlayClick={false}
            >
                {innerModal}
            </Modal>
        );
    }

}