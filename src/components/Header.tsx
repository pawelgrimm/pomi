import React, {ReactNode} from "react";

interface Props {
    children?: ReactNode
}

const Header: React.FC<Props> = ({children}) => {
    return (
        <header>
            <div>Pomi</div>
            {children}
        </header>
    )
}

export default Header;

