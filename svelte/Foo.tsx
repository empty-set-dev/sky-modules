export default function Foo(props: any) {
    return <Boo />
}

function Boo() {
    return (
        <div className="Boo">
            <a href="https://google.com">Google</a>

            <>
                <div>123</div>
                <span>span</span>
            </>
        </div>
    )
}
