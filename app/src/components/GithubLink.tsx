import { Avatar } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
interface Props {
    url: string;
}

const GithubLink = (props: Props): JSX.Element => {
    return (
        <>
            <Avatar component={"a"} href={props.url} color={"rgba(115, 114, 114, 1)"} size={"xl"} alt="my github link" target="_blank">
                <IconBrandGithub size={50} />
            </Avatar>
        </>
    )
}


export default GithubLink;