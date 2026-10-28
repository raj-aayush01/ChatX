import SearchBar from "./../conversations/SearchBar" ;
import ConversationList from "../conversations/ConversationList";

function Sidebar({ selectedChatId, onSelectedChat }) {
    return (
        <aside className="chat-sidebar">
            <div className="chat-brand">ChatX</div>

            <SearchBar />
            <ConversationList 
                selectedChatId={selectedChatId}
                onSelectedChat={onSelectedChat}
            />
        </aside>
    )
}

export default Sidebar ;