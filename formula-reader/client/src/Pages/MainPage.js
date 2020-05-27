import React from 'react';
import scrollToComponent from 'react-scroll-to-component';
import Carousel from 'nuka-carousel';
import env from "./../Assets/env"

import {
    Header,
    Icon,
    Segment,
    Grid,
    Divider,
    Container,
    Button,
    Image
} from 'semantic-ui-react'

import back from "../Images/back.jpg";
import spec from "../Images/specification.png";
import analysis from "../Images/analysis.png";
import design from "../Images/design.png";
import low from "../Images/low.png";
import final from "../Images/final.png";
import avatar1 from "../Images/avatar.jpg";
import avatar2 from "../Images/avatar2.jpeg";
import avatar3 from "../Images/avatar3.jpg";


export default class MainPage extends React.Component {

    state = {
        list : [
            {
                name: "About",
                icon: "superscript"
            },
            {
                name: "Reports",
                icon: "folder open"
            },
            {
                name: "Members",
                icon: "male"
            }
        ],
        width: window.innerWidth
    };

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    };

    render(){

        const {list, width } = this.state;

        const isMobile = width <= 1000;

        return (
            <Grid columns='equal'>

                {!isMobile ?
                    <Grid.Row style={{backgroundImage: `url(${back})`, backgroundSize: "2500px 2050px"}}>
                        <Grid.Column textAlign="center">
                            <br/>

                            <div className="c9-text-title">&Sigma;&nbsp;Sounds</div>

                            <div className="c9-text-sub-title">
                                Sum of Sounds: Listen to the formulas
                            </div>
                            {list.map(item => (
                                    <Button className="c9-btn"
                                            as='a'
                                            onClick={() => scrollToComponent(this[item.name],
                                                { offset: 0, align: 'top', duration: 700, ease:'inExpo'}) }
                                    >
                                        <Icon name={item.icon} />
                                        {item.name}
                                    </Button>
                                )
                            )}

                            <a href={env.app}>
                                <Button className="c9-btn">
                                    <Icon name="computer" />
                                    Go to app
                                </Button>
                            </a>

                            <br/>
                        </Grid.Column>
                    </Grid.Row>
                    : null }

                <Grid.Row className="min-width-480">

                    {!isMobile ? <Grid.Column width={2}/> : <Grid.Column width={1} />}

                    <Grid.Column width={!isMobile ? 12 : 14}>
                        <section ref={(Segment) => { this.About = Segment; }}>
                            <Segment basic>
                                <Divider horizontal className="div-margin">
                                    <Header as='h1'>ABOUT</Header>
                                </Divider>

                                <Container fluid className={!isMobile ? "c9-text-cool" : "c9-text-cool-small"}>
                                    Nowadays speech synthesis technologies are very popular and there are lots of text-to-speech applications on the market that read books, articles, docs
                                    in an almost human voice. All of them read plain texts without any problems, but when there are mathematical formulas or equations
                                    in the text almost all of the text-to-speech applications have trouble with voicing them.
                                    However, there are people with visual impairments who do research in mathematics or physics and need to read
                                    scientific articles and books, which usually contain lots of formulas and cannot be read by these applications.
                                    This motivated our team to develop an application that could voice the mathematical formulas and equations.
                                    Such a project can be useful for both developers of text-to-speech applications and people with vision problems.
                                </Container>

                            </Segment>
                        </section>

                        <section ref={(Segment) => { this.Reports = Segment; }}>
                            <Segment basic>
                                <Divider horizontal className="div-margin">
                                    <Header as='h1'>REPORTS</Header>
                                </Divider>

                                <Grid columns={5} divided>
                                    <Grid.Row>
                                        <Grid.Column
                                            className="cursor"
                                            onClick={()=> window.open("https://github.com/bilalsiraj/sumOfSounds/blob/master/Reports/Project%20Specifications%20Report.pdf", "_blank")
                                            }
                                        >
                                            <Image src={spec} size="massive" />
                                            <Container fluid className="c9-text-png" content="Specification Report"/>
                                        </Grid.Column>
                                        <Grid.Column
                                            className="cursor"
                                            onClick={()=> window.open("https://github.com/bilalsiraj/sumOfSounds/blob/master/Reports/Analysis%20Report.pdf", "_blank")}
                                        >
                                            <Image src={analysis} size="massive"/>
                                            <Container fluid className="c9-text-png" content="Analysis Report"/>
                                        </Grid.Column>
                                        <Grid.Column
                                            className="cursor"
                                            onClick={()=> window.open("https://github.com/bilalsiraj/sumOfSounds/blob/master/Reports/High-Level%20Report.pdf", "_blank")}
                                        >
                                            <Image src={design} size="massive"/>
                                            <Container fluid className="c9-text-png" content="High-level design Report"/>
                                        </Grid.Column>
                                        <Grid.Column
                                            className="cursor"
                                            onClick={()=> window.open("https://github.com/bilalsiraj/sumOfSounds/blob/master/Reports/Low-Level%20Design%20Report.pdf", "_blank")}
                                        >
                                            <Image src={low} size="massive"/>
                                            <Container fluid className="c9-text-png" content="Low-level design Report"/>
                                        </Grid.Column>
                                        <Grid.Column
                                            className="cursor"
                                            onClick={()=> window.open("https://github.com/bilalsiraj/sumOfSounds/blob/master/Reports/Final%20Report.pdf", "_blank")}
                                        >
                                            <Image src={final} size="massive"/>
                                            <Container fluid className="c9-text-png" content="Final Report"/>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>

                            </Segment>
                        </section>

                        <section ref={(Segment) => { this.Members = Segment; }}>
                            <Segment basic>
                                <Divider horizontal className="div-margin">
                                    <Header as='h1'>MEMBERS</Header>
                                </Divider>

                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={4}/>
                                        <Grid.Column width={8}>
                                            <Carousel>
                                                <div>
                                                    <Image src={avatar3} size="massive"/>
                                                    <Container fluid className="c9-text-png" content="Bilal Siraj"/>
                                                    <br/>
                                                    <br/>
                                                </div>
                                                <div>
                                                    <Image src={avatar2} size="massive"/>
                                                    <Container fluid className="c9-text-png" content="Aliyu Saifullah Vandana"/>
                                                    <br/>
                                                    <br/>
                                                </div>
                                                <div>
                                                    <Image src={avatar1} size="massive"/>
                                                    <Container fluid className="c9-text-png" content="Kasymbek Tashbaev"/>
                                                    <br/>
                                                    <br/>
                                                </div>
                                            </Carousel>
                                        </Grid.Column>
                                        <Grid.Column width={4}/>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </section>
                    </Grid.Column>

                    {!isMobile ? <Grid.Column width={2}/> : <Grid.Column width={1} />}

                </Grid.Row>
            </Grid>
        )
    }
}