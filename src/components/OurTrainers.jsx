import {STATIC_ASSETS} from 'trc-client-core/src/constants/url';
import AboutCopy from 'trc-client-core/src/copy/About.md';

import UserStore from 'trc-client-core/src/user/UserStore';
import Markdown from 'trc-client-core/src/components/Markdown';
import Site from 'trc-client-core/src/constants/Site';

import Auth from 'trc-client-core/src/components/Auth';
import Grid from 'trc-client-core/src/components/Grid';
import Col from 'trc-client-core/src/components/Col';

function Trainer(props) {
    return <div className="Media margin-bottom2 margin-top2">
        <img className="Media_image" src={`${STATIC_ASSETS}img/trainer_logos/${props.name.replace(' ', '+')}.png`} height="150" width="150"/>
        <div className="Media_body">
            <h2 className="hug-top">{props.name}</h2>
            {props.children}
        </div>
    </div>
}


export default function About(props) {
    return <div>
        <h1>Our Trainers</h1>
        <Trainer name="Australian Institute Of Management">
            <p>The Australian Institute of Management is not for profit entity which invests its annual surpluses in the creation of education products, alternative education distribution channels and learning support materials. <br/> The purpose of AIM is to promote the advancement of education and learning in the field of management and leadership for commerce, industry and government.</p>
        </Trainer>
        <Trainer name="BIResults (Pty Ltd)">
            <p>BIResults was born of experience in the Toyota Way and the various systems and processes utilised by the Toyota and Lexus Dealer network. These systems include: Tune, Showroom Direct, Showroom Foundations and STEAM - among others.</p>            
            <p>BIResults is led by Allan Lorraine, who br/idges the corporate and retail worlds with several years&apos; experience across both facets.</p>            
            <p>In more recent times, our Subject Matter Experts (SME&apos;s) have been consulting and Training Toyota and Lexus Dealers on sales and after sales kaizen activity. BIResults is a key partner in the on-going development of Toyota processes, systems and training.</p>
        </Trainer>
        <Trainer name="Boyle Consulting">
            <p>Boyle Consulting Pty Ltd delivers industry respected consulting and training advice to automotive manufacturers and networks across Australia and Internationally. For over 25 years we have enhanced network performance through insightful consulting advice and the design and delivery of training which engages automotive leaders, sales, service and parts teams. </p>             
            <p>Boyle Consulting people are highly experienced, trusted and consistently perform to the highest standards in meeting client expectations. Developing Leaders is our Mission.</p>
        </Trainer>
        <Trainer name="Sewells Group">
            <p>Sewells Group is a global consulting and outsourcing firm which specialises in the automotive retail industry. <br/>We operate across the Asia Pacific and Africa regions.  We are in the business of improving the performance of individuals and organisations engaged in automotive retail. Our in-depth subject matter expertise in this area and our deep engagements with many leading automotive br/ands make us a leader in our business.</p>
        </Trainer>
        <Trainer name="Marketing Methods">
            <p>Marketing Methods are a unique team with an outlook and approach which they think you&apos;ll find refreshing. When they work with you, they become an extension of your organization, fulfilling your marketing needs as you focus on your company&apos;s goals. They will offer your team a blend of pragmatism and passion and will be relentlessly driven to exceed your expectations.</p>
        </Trainer>
        <Trainer name="Human Synergy">
            <p>Human Synergy is a boutique consultancy specialising in customised engagements that really make a difference. We offer a range of services including High Performance Execution (HPE) Culture development, High Performance Partnerships &amp; Channel enablement. </p><p>Their philosophy is one of ongoing engagement that is born out of a deep understanding that change takes time &amp; continued effort and without an outside eye, our clients very quickly fall back into old habits.</p>
        </Trainer>
        <Trainer name="Safety Action">
            <p>An innovative consultancy, providing workplace safety and business risk solutions for progressive organisations. Our vision is to be widely regarded as the premier provider in Australasia.Their mission is to deliver practical tools and services to help our clients achieve their business objectives in relation to workplace safety &amp; business risk. We will continue to be a reliable resource for our clients &amp; friends.</p>
        </Trainer>
        <Trainer name="Think Satisfaction">
            <p>Jacqui Morrison-White is the principal consultant and trainer at Think Satisfaction and has extensive automotive expertise having spent in excess of 20 years in the industry.Specialising in Customer Relationship Management, Customer Satisfaction and the Customer Experience Think Satisfaction has worked both in Australia and overseas, developing training and business strategy in and around customer centricity and customer retention. Jacqui is an in demand consultant and trainer, and coming from a Dealer background, Jacqui&rsquo;s real life experiences working &lsquo;at the coal face&rsquo; of automotive CRM add vital credibility to her experience and knowledge.</p>
        </Trainer>
    </div>;
}