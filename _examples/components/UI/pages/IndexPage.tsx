import Helmet from 'pkgs/react-helmet'
import Button from 'sky/components/UI/Button'
import DatePicker from 'sky/components/UI/DatePicker'
import Dropdown from 'sky/components/UI/Dropdown'
import Field from 'sky/components/UI/Field'
import Select from 'sky/components/UI/Select'
import TextArea from 'sky/components/UI/TextArea'

import styles from './IndexPage.module.scss'

const cx = cn('[IndexPage]', styles)
export default function IndexPage(): ReactNode {
    return (
        <div className={cx`[IndexPage]`}>
            <Helmet>
                <link
                    href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
                    rel="stylesheet"
                />
            </Helmet>
            <header>
                <div className="container ContainerExample1">container</div>
                <div className="container ContainerExample2">container</div>
                <div className="container ContainerExample3">
                    <div className="row">
                        <div className={cx`col col1`}>1</div>
                        <div className={cx`col col1`}>2</div>
                        <div className={cx`col col1`}>3</div>
                    </div>
                    <div className="row">
                        <div className="col col2">
                            <div className="UIRow">
                                <Field label="Field" />
                            </div>
                            <div className="UIRow">
                                <TextArea label="Text Area" />
                            </div>
                            <div className="UIRow">
                                <Button>Button</Button>
                            </div>
                            <div className="UIRow">
                                <Select
                                    options={[
                                        {
                                            title: 'Option 1',
                                            value: '1',
                                        },
                                        {
                                            title: 'Option 2',
                                            value: '2',
                                        },
                                        {
                                            title: 'Option 3',
                                            value: '3',
                                        },
                                    ]}
                                />
                            </div>
                            <div className="UIRow">
                                <Dropdown
                                    title="Dropdown"
                                    options={[
                                        {
                                            title: 'Option 1',
                                            value: '1',
                                        },
                                        {
                                            title: 'Option 2',
                                            value: '2',
                                        },
                                        {
                                            title: 'Option 3',
                                            value: '3',
                                        },
                                    ]}
                                />
                            </div>
                            <div className="UIRow">
                                <DatePicker />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}
