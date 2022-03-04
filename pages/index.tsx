import React, { Fragment, useEffect, useRef, useState } from 'react'
import { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import { getFirstString, removeQueryString } from '../src/urlHelpers'

const Bug: NextPage = () => {
    const router = useRouter()

    const storedStatusRef = useRef<string | undefined>('initial_value')

    // initializing this with `true` would fix the buggy behavior
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        // commenting this out would fix the buggy behavior
        setLoaded(true)
    }, [])

    const updateRef = (newStatus: string) => {
        // commenting this out would fix the buggy behavior
        storedStatusRef.current = newStatus
        // commenting this out would fix the buggy behavior
        setLoaded(true)
    }

    // only using router.query.status would fix the buggy behavior
    const status = getFirstString(router.query.status) ?? storedStatusRef.current ?? ''

    console.log('bugcomponent render   ', JSON.stringify({ status }))
    useEffect(() => {
        // FIXME this should be called everytime status changes, but react behaves buggy and does not trigger it when clicking the "trigger bug" button after the reload without url parameters.
        console.log('bugcomponent useEffect', JSON.stringify({ status }))
    }, [status])

    const onChangeStatus = (newStatus: string) => {
        updateRef(newStatus)
        // updating the url shallowly will update router.query which will rerender this component with updated router.query
        void Router.replace(`${removeQueryString(router.asPath)}?status=${newStatus ?? ''}`, undefined, { shallow: true })
    }

    return (
        <Fragment>
            <Head>
                <title>Bug</title>
            </Head>
            <p>
                To see the bug, open the console, and observe the logged useEffect calls when clicking the "reload without parameters" button and then the
                "trigger bug" button. The component is rendered with a changed "status":"updated_value", but the useEffect is not called.
            </p>
            <p>After that, clicking the "set to initial_value" button triggers the useEffect correctly.</p>
            <p>Current status: {status}</p>
            <div style={{ display: 'grid', gridGap: 8, gridTemplateColumns: 'max-content' }}>
                <button
                    onClick={() => {
                        window.location.replace('/')
                    }}
                >
                    reload without parameters
                </button>
                <button
                    onClick={() => {
                        onChangeStatus('updated_value')
                    }}
                >
                    trigger bug
                </button>
                <button
                    onClick={() => {
                        onChangeStatus('initial_value')
                    }}
                >
                    set to initial_value
                </button>
            </div>
        </Fragment>
    )
}

export const getStaticProps: GetStaticProps<{}> = async () => {
    return { props: {} }
}

export default Bug
