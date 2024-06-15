import { observer } from "mobx-react-lite";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { UserModel } from "@/entities/user";
import './styles.scss';

interface UserBadgeProps {
    user: UserModel.UserDto;
}

export const UserBadge: React.FunctionComponent<UserBadgeProps> = observer(({ user }) => {
    return (
        <div className="user-badge">
            <div className="user-badge__name">{user.username}</div>
            <Avatar>
                <AvatarImage className="max-w-[24px] max-h-[24px]" src="images/png/user.png" alt="Аватар"/>
                <AvatarFallback>
                    ?
                </AvatarFallback>
            </Avatar>
        </div>
    );
});
