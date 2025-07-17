interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  imageUrl?: string;
  imageFileName?: string;
}

export class SearchApp {
  private container: HTMLElement;
  private messages: Message[] = [];
  private isSearchMode: boolean = true;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  init() {
    this.render();
  }

  private render() {
    if (this.isSearchMode) {
      this.renderInitialState();
    } else {
      this.renderConversationState();
    }
  }

  private renderInitialState() {
    this.container.innerHTML = `
            <div class="min-h-screen flex flex-col items-center justify-center px-4">
                <!-- Greeting -->
                <div class="mb-12">
                    <h1 class="text-4xl font-bold bg-blue-purple-gradient bg-clip-text text-transparent">
                        Hello, Le Vo
                    </h1>
                </div>

                <!-- Search Container -->
                <div class="w-full max-w-2xl">
                    <div class="relative">
                        <!-- Source Tag -->
                        <div class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                            <span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                                Source
                            </span>
                        </div>

                        <!-- Search Input -->
                        <input 
                            type="text" 
                            id="searchInput"
                            placeholder="Search your data and ask questions"
                            class="w-full pl-24 pr-24 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg bg-white shadow-sm"
                        />

                        <!-- Right Side Buttons -->
                        <div class="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                            <!-- Image Upload Button -->
                            <button 
                                id="imageUploadBtn"
                                class="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Upload image"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                            </button>

                            <!-- Send Button -->
                            <button 
                                id="sendBtn"
                                class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                title="Send"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Hidden File Input -->
                <input type="file" id="fileInput" accept="image/*" class="hidden" />
            </div>
        `;

    this.attachInitialStateListeners();
  }

  private renderConversationState() {
    this.container.innerHTML = `
            <div class="min-h-screen flex flex-col">
                <!-- Messages Container -->
                <div class="flex-1 overflow-y-auto px-4 py-6">
                    <div class="max-w-4xl mx-auto">
                        <div id="messagesContainer" class="space-y-6">
                            ${this.messages
                              .map((message) => this.createMessageHTML(message))
                              .join("")}
                        </div>
                    </div>
                </div>

                <!-- Input Footer -->
                <div class="border-t border-gray-200 bg-white px-4 py-4">
                    <div class="max-w-4xl mx-auto">
                        <div class="relative">
                            <input 
                                type="text" 
                                id="conversationInput"
                                placeholder="Ask a follow-up question..."
                                class="w-full pl-4 pr-16 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
                            />
                            <button 
                                id="conversationSendBtn"
                                class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                                </svg>
                            </button>
                        </div>
                        <p class="text-xs text-gray-500 mt-2 text-center">
                            AI generator may give incorrect information. Please verify important facts.
                        </p>
                    </div>
                </div>
            </div>
        `;

    this.attachConversationListeners();
  }

  private createMessageHTML(message: Message): string {
    if (message.isUser) {
      const imageContent = message.imageUrl
        ? `
                <div class="mb-2">
                    <img src="${message.imageUrl}" alt="${
            message.imageFileName || "Uploaded image"
          }" 
                         class="max-w-full h-auto rounded-lg max-h-48 object-cover" />
                    <p class="text-xs opacity-75 mt-1">${
                      message.imageFileName || "Image"
                    }</p>
                </div>
            `
        : "";

      return `
                <div class="flex justify-end">
                    <div class="max-w-xs lg:max-w-md bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-3">
                        ${imageContent}
                        ${
                          message.text
                            ? `<p class="text-sm">${message.text}</p>`
                            : ""
                        }
                    </div>
                </div>
            `;
    } else {
      return `
                <div class="flex justify-start">
                    <div class="max-w-xs lg:max-w-md bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        <p class="text-sm text-gray-800">${message.text}</p>
                    </div>
                </div>
            `;
    }
  }

  private attachInitialStateListeners() {
    const searchInput = document.getElementById(
      "searchInput"
    ) as HTMLInputElement;
    const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement;
    const imageUploadBtn = document.getElementById(
      "imageUploadBtn"
    ) as HTMLButtonElement;
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;

    const handleSearch = () => {
      const query = searchInput.value.trim();
      if (query) {
        this.handleInitialSearch(query);
      }
    };

    sendBtn.addEventListener("click", handleSearch);

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    });

    imageUploadBtn.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        this.handleImageUpload(file);
      }
    });
  }

  private attachConversationListeners() {
    const conversationInput = document.getElementById(
      "conversationInput"
    ) as HTMLInputElement;
    const conversationSendBtn = document.getElementById(
      "conversationSendBtn"
    ) as HTMLButtonElement;

    const handleMessage = () => {
      const query = conversationInput.value.trim();
      if (query) {
        this.addMessage(query, true);
        conversationInput.value = "";
        this.simulateResponse(query);
      }
    };

    conversationSendBtn.addEventListener("click", handleMessage);

    conversationInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleMessage();
      }
    });
  }

  private handleInitialSearch(query: string) {
    // Add the initial user message
    this.addMessage(query, true);

    // Switch to conversation mode
    this.isSearchMode = false;
    this.render();

    // Simulate initial response
    this.simulateResponse(query);
  }

  private handleImageUpload(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      this.addImageMessage(imageUrl, file.name);

      // Switch to conversation mode if in search mode
      if (this.isSearchMode) {
        this.isSearchMode = false;
        this.render();
      }

      // Simulate response about the image
      this.simulateImageResponse(file.name);
    };
    reader.readAsDataURL(file);
  }

  private addMessage(text: string, isUser: boolean) {
    const message: Message = {
      id: Date.now().toString(),
      text: text,
      isUser: isUser,
      timestamp: new Date(),
    };

    this.messages.push(message);

    if (!this.isSearchMode) {
      this.updateMessagesDisplay();
    }
  }

  private addImageMessage(
    imageUrl: string,
    fileName: string,
    additionalText?: string
  ) {
    const message: Message = {
      id: Date.now().toString(),
      text: additionalText || "",
      isUser: true,
      timestamp: new Date(),
      imageUrl: imageUrl,
      imageFileName: fileName,
    };

    this.messages.push(message);

    if (!this.isSearchMode) {
      this.updateMessagesDisplay();
    }
  }

  private updateMessagesDisplay() {
    const messagesContainer = document.getElementById("messagesContainer");
    if (messagesContainer) {
      messagesContainer.innerHTML = this.messages
        .map((message) => this.createMessageHTML(message))
        .join("");
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  private simulateResponse(query: string) {
    // Simulate a delay for AI response
    setTimeout(() => {
      let response = "";

      if (
        query.toLowerCase().includes("hello") ||
        query.toLowerCase().includes("hi")
      ) {
        response =
          "Hello! I'm here to help you search and find information. What would you like to know?";
      } else if (
        query.toLowerCase().includes("image") ||
        query.toLowerCase().includes("upload")
      ) {
        response =
          "I can see you've uploaded an image. I can help analyze visual content and answer questions about what I see. What specific information are you looking for?";
      } else {
        response = `I understand you're asking about "${query}". Based on the available data, I can provide you with relevant information. Here's what I found that might help answer your question.`;
      }

      this.addMessage(response, false);
    }, 1000);
  }

  private simulateImageResponse(fileName: string) {
    // Simulate a delay for AI response to image
    setTimeout(() => {
      const response = `I can see you've uploaded "${fileName}". I can analyze this image and help you with questions about its content, objects, text, colors, or any other visual elements. What would you like to know about this image?`;

      this.addMessage(response, false);
    }, 1000);
  }
}
