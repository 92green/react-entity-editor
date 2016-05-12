import {STATIC_ASSETS} from 'trc-client-core/src/constants/url';

export default function TrainingCalendars(props) {
    var tech = (props.location.query.page === 'technical') ? 'tech' : '';
    var urlCalendar = `${STATIC_ASSETS}docs/calendars/${tech}Calendar`;

    return <div>
        <h1>Training Calendars</h1>
        <table className="Table w50">
            <tbody>
                <tr>
                    <td>Northern Region</td>
                    <td><a target="_blank" href={`${urlCalendar}_NRO.pdf`} className="Button">Download</a></td>
                </tr>
                <tr>
                    <td>Eastern Region</td>
                    <td><a target="_blank" href={`${urlCalendar}_ERO.pdf`} className="Button">Download</a></td>
                </tr>
                <tr>
                    <td>Southern Region</td>
                    <td><a target="_blank" href={`${urlCalendar}_SRO.pdf`} className="Button">Download</a></td>
                </tr>
                <tr>
                    <td>Central Region</td>
                    <td><a target="_blank" href={`${urlCalendar}_CRO.pdf`} className="Button">Download</a></td>
                </tr>
                <tr>
                    <td>Toyota WA</td>
                    <td><a target="_blank" href={`${urlCalendar}_WA.pdf`} className="Button">Download</a></td>
                </tr>
            </tbody>
        </table>
    </div>;
}